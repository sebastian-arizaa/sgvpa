import { useRef, useState } from "react"
import { Title } from "./base/Title"
import { Button } from "./base/Button"

interface Props {
  aprendizId: string
}

export function Actas({ aprendizId }: Props) {
  console.log("🚀 ~ Actas ~ aprendizId:", aprendizId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [actaAbierta, setActaAbierta] = useState(false)
  const [actaData, setActaData] = useState<{ nombre: string } | null>(null)
  const [archivoSubido, setArchivoSubido] = useState<File | null>(null)
  const [archivoSubidoError, setArchivoSubidoError] = useState<{ mensaje: string } | null>(null)

  const actas = [
    { nombre: "Acta 1", estado: "Disponible", entragado: true, fecha: "24/04/2025" },
    { nombre: "Acta 2", estado: "No Disponible", entragado: false, fecha: "15/07/2025" },
    { nombre: "Acta 3", estado: "No Disponible", entragado: false },
  ]

  const inputFileOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const archivo = e.target.files[0]

    if (archivoSubidoError) {
      setArchivoSubidoError(null)
    }

    if (archivo.size <= 11) {
      setArchivoSubidoError({ mensaje: "El archivo esta vacio" })
    } else if (!/.pdf$/.test(archivo.name)) {
      setArchivoSubidoError({ mensaje: "El archivo seleccionado no cuenta con la extension .pdf" })
    }
    setArchivoSubido(archivo)
    console.log("🚀 ~ inputFileOnchange ~ archivo:", archivo)
  }

  const cancelarSubirArchivo = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    setArchivoSubido(null)
  }

  const abrirActa = (nombreActa: string) => {
    setActaAbierta(true)
    setActaData({ nombre: nombreActa })
  }

  return (
    <div className="relative grow flex flex-col justify-center gap-4 w-full px-[20%]">
      <Title variante="lineaAbajo" tamaño="grande">Actas</Title>
      <div className="w-full flex flex-col gap-4">
        {actas.map((acta) => (
          <div
            onClick={() => abrirActa(acta.nombre)}
            key={acta.nombre}
            className={`
              w-full flex flex-col gap-4 min-h-26 pl-4 py-2 border-l-4 cursor-pointer hover:bg-gray-200 shadow-sm
              ${acta.estado === "Disponible" ? 'border-green-200' : 'border-gray-200'} 
              ${acta.estado === "Finalizado" && (!acta.entragado ? 'border-red-500!' : 'border-green-500!')} `}
          >
            <p className="font-semibold text-lg">{acta.nombre}</p>
            <p>{acta.estado} {acta.estado === "Finalizado" && (acta.entragado ? 'Entragado' : 'No entregado')}</p>
            <p>{acta.fecha ? ("Plazo maximo: " + acta.fecha) : 'Sin Fecha'}</p>
          </div>
        ))}
      </div>
      {actaAbierta && (
        <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-center bg-black/60">
          <div className="flex flex-col items-center gap-4 w-1/2 px-4 py-8 bg-white ">
            <div className="w-full">
              <Title variante="lineaAbajo" tamaño="grande">{actaData?.nombre}</Title>
            </div>
            <p className="font-semibold">Acta Actual : Acta 1.pdf</p>
            <Button variante="primario">Descargar Acta</Button>
            <p className="w-full text-center text-sm">Aviso: Al subir una acta no hay problema por el nombre al subirse, este nombre se cambiará internamente</p>
            <p className="w-full text-center text-sm">Aviso: La Acta debe ser de extension .pdf</p>
            {(!archivoSubido || archivoSubidoError) && (
              <>
                <label
                  htmlFor="actaArchivo"
                  className="w-full p-2 font-semibold text-white text-center bg-green-500 hover:bg-green-600 cursor-pointer"
                >Subir Archivo</label>
                <Button onClick={() => setActaAbierta(false)} variante="peligro">Salir</Button>
              </>
            )}
            <input ref={inputRef} onInput={inputFileOnchange} className="hidden" id="actaArchivo" type="file" />
            {archivoSubido && <p className="text-sm font-semibold">Archivo: {archivoSubido.name}</p>}
            {archivoSubidoError && <p className="text-sm text-red-500">{archivoSubidoError.mensaje}</p>}
            {archivoSubido && !archivoSubidoError && (
              <>
                <p className="text-sm font-semibold">Como se guardará: Acta 1 (firmada).pdf</p>
                {archivoSubido && <Button variante="primario">Subir Acta</Button>}
              </>
            )}
            {archivoSubido && !archivoSubidoError && <Button onClick={cancelarSubirArchivo} variante="peligro">Cancelar</Button>}
          </div>
        </div>
      )}
    </div>
  )
}
