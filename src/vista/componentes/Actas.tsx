import { useContext, useEffect, useRef, useState } from "react"
import { Title } from "./base/Title"
import { Button } from "./base/Button"
import { appAxios } from "../../utils/axios";
import { Subtitle } from "./base/Subtitle";
import { Input } from "./base/Input";
import { useForm } from "react-hook-form";
import { ActaType } from "../../types";
import { SessionContext } from "../context/SessionContext";

interface Props {
  aprendizId: string
}

export function Actas({ aprendizId }: Props) {
  const { userTipo } = useContext(SessionContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const [actaAbierta, setActaAbierta] = useState(false)
  const [actaData, setActaData] = useState<ActaType | null>(null)
  const [archivoSubido, setArchivoSubido] = useState<File | null>(null)
  const [archivoSubidoError, setArchivoSubidoError] = useState<{ mensaje: string } | null>(null)
  const [respuestaBD, setRespuestaBD] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const [habilitandoActa, setHabilitandoActa] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [actas, setActas] = useState<ActaType[] | null>(null)

  const inputFileOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const archivo = e.target.files[0]

    if (archivoSubidoError) {
      setArchivoSubidoError(null)
    }

    if (archivo.size <= 11) {
      setArchivoSubidoError({ mensaje: "El archivo esta vacio" })
    } else if (!/(.pdf|.doc|.docx)$/.test(archivo.name)) {
      setArchivoSubidoError({ mensaje: "El archivo seleccionado no cuenta con las extensiones especificadas" })
    }
    setArchivoSubido(archivo)
  }

  const cancelarSubirArchivo = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    setArchivoSubido(null)
    setActaAbierta(false)
  }

  const abrirActa = (acta: ActaType) => {
    setActaAbierta(true)
    setActaData(acta)
  }

  const conseguirExtension = (nombreArchivo: string) => {
    const arreglo = nombreArchivo.split(".")
    return arreglo[arreglo.length - 1]
  }

  const subirActa = async () => {
    try {
      setCargando(true)
      if (!archivoSubido || !actaData || !actaData.plazo_maximo || !actas) return

      const form = new FormData()
      form.append("file", archivoSubido)
      const extension = conseguirExtension(archivoSubido.name)
      let nombreArchivo: string = ""
      if (userTipo === "aprendiz") nombreArchivo = actaData.nombre + "(firmado)" + "." + extension
      if (userTipo !== "aprendiz") nombreArchivo = actaData.nombre + "." + extension
      form.append("nuevoNombre", nombreArchivo)
      if (actaData.nombre_archivo) form.append("nombreGuardado", actaData.nombre_archivo)
      form.append("nombreDirectorio", actaData.nombre_directorio)
      const { data, status } = await appAxios.post(`/server/megajs/archivo/uno`, form)

      const nuevaActa: ActaType = {
        ...actaData,
        plazo_maximo: actaData.plazo_maximo.split("T")[0],
        nombre_archivo: nombreArchivo,
        entregada: userTipo === "aprendiz",
        cerrada: userTipo === "aprendiz",
        estado: userTipo === "aprendiz" ? "Finalizada" : "Disponible"
      }
      await appAxios.put(`/server/actas/una/${actaData.id}`, nuevaActa)

      const actaIndex = actas?.findIndex((acta) => acta.id === nuevaActa.id)
      const nuevasActas = [...actas]
      nuevasActas[actaIndex] = nuevaActa
      setActas(nuevasActas)
      setActaData(nuevaActa)

      if (status === 200) {
        setRespuestaBD(data)
        setCargando(false)
        setArchivoSubido(null)
      }
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    } catch (error: any) {
      console.log("Error: ", error)
      setCargando(false)
    }
  }

  const eliminarActa = async () => {
    try {
      if (!actaData || !actaData.nombre_archivo || !actaData.plazo_maximo) return
      setCargando(true)
      const nombreDirectorio = actaData.nombre_directorio
      const nombreArchivo = actaData.nombre_archivo
      const { data, status } = await appAxios.delete(`/server/megajs/archivo/uno/${nombreDirectorio}/${nombreArchivo}`)

      if (!actaData || !actas) return
      const nuevaActa: ActaType = {
        ...actaData,
        nombre_archivo: null,
        plazo_maximo: actaData.plazo_maximo.split("T")[0]
      }
      await appAxios.put(`/server/actas/una/${actaData.id}`, nuevaActa)

      setActaData(nuevaActa)
      if (status === 200) {
        setRespuestaBD(data)
        setCargando(false)
        setArchivoSubido(null)
        setRespuestaBD(null)
      }
    } catch (error: any) {
      console.log("Error: ", error)
      setRespuestaBD(error.response.data)
      setCargando(false)
    }
  }

  const descargarActa = async () => {
    try {
      if (!actaData || !actaData.nombre_archivo) return
      setCargando(true)
      const nombreDirectorio = actaData.nombre_directorio
      const nombreArchivo = actaData.nombre_archivo
      const { data } = await appAxios.get(`/server/megajs/archivo/uno/${nombreDirectorio}/${nombreArchivo}`, { responseType: "blob" })

      const url = URL.createObjectURL(data)
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nombreArchivo);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setRespuestaBD("Archivo descargado Correctamente!")
      setCargando(false)
    } catch (error: any) {
      console.log("Error: ", error)
      setCargando(false)
    }
  }

  const salirActa = () => {
    setActaAbierta(false)
    setRespuestaBD(null)
    setArchivoSubido(null)
    setArchivoSubidoError(null)
    setHabilitandoActa(false)
    reset({ plazoMaximo: "" })
  }

  const habilitarActa = handleSubmit(async (formData) => {
    try {
      if (!actaData || !actas) return
      const nuevaActa: ActaType = {
        ...actaData,
        estado: "Disponible",
        cerrada: false,
        plazo_maximo: formData.plazoMaximo
      }
      await appAxios.put(`/server/actas/una/${actaData.id}`, nuevaActa)
      const actaIndex = actas?.findIndex((acta) => acta.id === nuevaActa.id)
      const nuevasActas = [...actas]
      nuevasActas[actaIndex] = nuevaActa
      setActas(nuevasActas)
      setHabilitandoActa(false)
      setActaAbierta(false)
      reset({ plazoMaximo: "" })
    } catch (error: any) {
      console.log("Error: ", error)
    }
  })

  const deshabilitarActa = async () => {
    try {
      if (!actaData || !actas) return
      let nuevaActa: ActaType
      if (!actaData.nombre_archivo) {
        nuevaActa = {
          ...actaData,
          cerrada: true,
          estado: "No Disponible",
          plazo_maximo: null,
        }
        await appAxios.put(`/server/actas/una/${actaData.id}`, nuevaActa)
      } else {
        nuevaActa = {
          ...actaData,
          cerrada: true,
          estado: "No Disponible",
          plazo_maximo: null,
          nombre_archivo: null
        }
        await appAxios.delete(`/server/megajs/archivo/uno/${actaData.nombre_directorio}/${actaData.nombre_archivo}`)
        await appAxios.put(`/server/actas/una/${actaData.id}`, nuevaActa)
      }
      const actaIndex = actas?.findIndex((acta) => acta.id === nuevaActa.id)
      const nuevasActas = [...actas]
      nuevasActas[actaIndex] = nuevaActa
      setActas(nuevasActas)
      setActaData(nuevaActa)
      setActaAbierta(false)
    } catch (error: any) {
      console.log("Error: ", error)
    }
  }


  useEffect(() => {
    try {
      const conseguirActas = async () => {
        const { data } = await appAxios.get<ActaType[]>(`/server/actas/todas-por-aprendiz/${aprendizId}`)
        setActas(data)
        console.log("🚀 ~ conseguirActas ~ data:", data)
      }
      conseguirActas()
    } catch (error: any) {
      console.log("Error: ", error)
    }
  }, [])

  useEffect(() => {
    try {
      const validarPlazosMaximos = async () => {
        if (!actas) return
        actas.forEach(async (acta) => {
          if (acta.plazo_maximo && !acta.cerrada) {
            const plazoMaximoFormateado = acta.plazo_maximo.split("T")[0].split("-").join("")
            const fechaActual = new Date().getFullYear().toString() + (new Date().getMonth() + 1).toString().padStart(2, "0") + new Date().getDate().toString().padStart(2, "0")
            if (Number(fechaActual) > Number(plazoMaximoFormateado)) {
              const nuevaActa: ActaType = {
                ...acta,
                cerrada: true,
                estado: "Finalizada",
                plazo_maximo: acta.plazo_maximo.split("T")[0]
              }
              await appAxios.put(`/server/actas/una/${acta.id}`, nuevaActa)
            }
          }
        })
      }
      validarPlazosMaximos()
    } catch (error: any) {
      console.log("Error: ", error)
    }
  }, [actas, actaData])

  return (
    <div className="relative grow flex flex-col justify-center gap-4 w-full px-[20%]">
      <Title variante="lineaAbajo" tamaño="grande">Actas</Title>
      <div className="w-full flex flex-col gap-4">
        {actas && actas.map((acta) => (
          <div
            onClick={() => abrirActa(acta)}
            key={acta.nombre}
            className={`
              relative w-full flex flex-col gap-4  min-h-26 pl-4 py-2 border-l-4 cursor-pointer hover:bg-gray-200 shadow-sm
              ${acta.estado === "Disponible" ? 'border-green-200' : 'border-gray-200'} 
              ${acta.estado === "Finalizada" && (!acta.entregada ? 'border-red-500!' : 'border-green-500!')} 
            `}
          >
            <p className="font-semibold text-lg">{acta.nombre}</p>
            <p>{acta.estado} {acta.estado === "Finalizada" && (acta.entregada ? '- Entregado' : '- No entregado')}</p>
            <p className="font-semibold">{acta.plazo_maximo ? ("Plazo maximo: " + acta.plazo_maximo.split("T")[0]) : 'Sin Fecha'}</p>
          </div>
        ))}
      </div>
      {actaAbierta && (
        <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-center bg-black/60">
          <div className="relative flex flex-col items-center gap-4 w-1/2 h-1/2 overflow-y-auto max-w-[600px] px-4 py-8 bg-white">
            {true && actaData?.estado === "Disponible" ? (
              <>
                <div className="w-full">
                  <Title variante="lineaAbajo" tamaño="grande">{actaData.nombre}</Title>
                </div>

                {actaData.nombre_archivo ? (
                  <>
                    <p className="font-semibold">Nombre actual: {actaData.nombre_archivo}</p>
                    <div className="w-full flex gap-4">
                      <Button onClick={descargarActa} variante="primario">Descargar Acta</Button>
                      {userTipo !== "aprendiz" && (
                        <>
                          <Button onClick={eliminarActa} variante="peligro">Eliminar Acta</Button>
                          <Button onClick={deshabilitarActa} variante="peligro">Deshabilitar Acta</Button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full">
                      <Subtitle variante="lineaAbajo">No hay una acta subida</Subtitle>
                    </div>
                    {userTipo !== "aprendiz" && (<Button onClick={deshabilitarActa} variante="peligro">Deshabilitar Acta</Button>)}
                  </>
                )}
                {(actaData.nombre_archivo || userTipo !== "aprendiz") && (
                  <>
                    <div className="w-full">
                      <Subtitle variante="lineaAbajo">Avisos para subir la acta</Subtitle>
                    </div>
                    <p className="w-full text-center text-sm">1: Al subir una acta no hay problema por el nombre al subirse, este nombre se cambiará internamente</p>
                    <p className="w-full text-center text-sm">2: La Acta debe ser de extension <strong>.pdf</strong>, <strong>.doc</strong> o <strong>.docx</strong></p>
                    <p className="w-full text-center text-sm">3: Para subir la acta presionar el boton <strong>subir archivo</strong>, selecciona la acta que deseas subir y finalmente dale al botón <strong>subir acta</strong></p>
                    {userTipo === "aprendiz" && <p className="w-full text-center text-sm">4: Solo se puede subir una vez el acta, en caso de haber subido la acta incorrecta, comunicarse con su instructor asignado y solicitar el habilitamiento de la acta para subir la acta correspondiente.</p>}
                  </>
                )}
                {((!archivoSubido && !archivoSubidoError && actaData.nombre_archivo !== null) || (userTipo !== "aprendiz" && !archivoSubido)) && (
                  <>
                    <label
                      htmlFor="actaArchivo"
                      className="w-full p-2 font-semibold text-white text-center bg-green-500 hover:bg-green-600 cursor-pointer"
                    >Subir Archivo</label>
                  </>
                )}
                <input ref={inputRef} onInput={inputFileOnchange} className="hidden" id="actaArchivo" type="file" />
                {archivoSubido && <p className="text-sm font-semibold text-center">Archivo: {archivoSubido.name}</p>}
                {archivoSubidoError && <p className="text-sm text-red-500">{archivoSubidoError.mensaje}</p>}
                {archivoSubido && !archivoSubidoError && (
                  <>
                    <p className="text-sm font-semibold">Como se guardará: {actaData.nombre}{userTipo === "aprendiz" ? "(firmada)" : ""}.{conseguirExtension(archivoSubido.name)}</p>
                    {archivoSubido && <Button onClick={subirActa} variante="primario">Subir Acta</Button>}
                  </>
                )}
                {archivoSubido && !archivoSubidoError && <Button onClick={cancelarSubirArchivo} variante="peligro">Cancelar</Button>}
              </>
            ) : (
              <>
                <div className="w-full">
                  <Title variante="lineaAbajo" tamaño="grande">{actaData?.nombre} {actaData?.estado === "No Disponible" ? "No dispoible" : "Finalizada"}</Title>
                </div>
                {(Boolean(actaData?.cerrada) && actaData?.nombre_archivo && userTipo !== "aprendiz") && (
                  <>
                    <p className="font-semibold">Nombre actual : {actaData.nombre_archivo}</p>
                    <div className="w-full flex gap-4">
                      <Button onClick={descargarActa} variante="primario">Descargar Acta</Button>
                    </div>
                  </>
                )}
                {habilitandoActa && (
                  <Input
                    name="plazoMaximo"
                    register={register}
                    errors={errors}
                    rules={{
                      validate: (value) => {
                        if (!value.length) return "Plazo Maximo requerido"
                        if (value.split("-")[0] < new Date().getFullYear()) return "Digite un año actual o mayor"
                        if (value.split("-")[0] == new Date().getFullYear() && value.split("-")[1] < (new Date().getMonth() + 1)) return "Digite un mes actual o mayor"
                        if (value.split("-")[0] == new Date().getFullYear() && value.split("-")[1] == (new Date().getMonth() + 1) && value.split("-")[2] < new Date().getDate()) return "Digite un dia actual o mayor"
                        return true;
                      }
                    }}
                    label="Plazo maximo"
                    type="date"
                  />
                )}
                {userTipo != "aprendiz" && <Button onClick={!habilitandoActa ? () => setHabilitandoActa(true) : habilitarActa} variante="primario">Habilitar Acta</Button>}
              </>
            )}
            {respuestaBD && (<p>{respuestaBD}</p>)}
            <div className="absolute top-2 left-2 w-8 h-8">
              <Button className="h-full" onClick={salirActa} variante="peligro">X</Button>
            </div>
          </div>
        </div >
      )
      }
      {
        cargando && (
          <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-center bg-black/60">
            <div className="flex flex-col items-center gap-4 w-1/2 px-4 py-8 bg-white ">
              <p>Cargando....</p>
            </div>
          </div>
        )
      }
    </div >
  )
}
