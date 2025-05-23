import { useForm } from "react-hook-form";
import { Input } from "../componentes/base/Input";
import { Title } from "../componentes/base/Title";
import { Button } from "../componentes/base/Button";
import { appAxios } from "../../utils/axios";
import { AprendicesFormacionesType, AprendizType, FormacionType } from "../../types";
import { generarSalt, hashContraseña } from "../../utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function CrearAprendiz() {
  // const [cargando, setCargando] = useState(true)
  const { id: formacionId } = useParams()
  const [mensajeErrorBD, setMensajeErrorBD] = useState<string | null>("")
  const [formacionEncontrada, setFormacionEncontrada] = useState<FormacionType | null>(null)
  const [exiteFormacion, setExiteFormacion] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch, reset, setError, clearErrors, setValue } = useForm()


  useEffect(() => {
    setValue("numeroFichaActual", formacionId)
  }, [])

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log("🚀 ~ onSubmit ~ formData:", formData)
      const salt = await generarSalt()
      const hash_contraseña = await hashContraseña(formData.contraseña, salt)

      if (!hash_contraseña) return console.log("No hay has Contraseña")

      const aprendiz: AprendizType = {
        id: formData.numeroIdentificacion,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email || null,
        formacion_actual_id: formData.numeroFichaActual,
        hash_contraseña: hash_contraseña,
        salt: salt,
        telefono: formData.telefono || null
      }

      const aprendicesFormaciones: AprendicesFormacionesType = {
        activa: true,
        aprendiz_id: formData.numeroIdentificacion,
        formacion_id: formacionId || '',
        id: 0
      }

      const actaId = aprendiz.id + "-" + aprendiz.formacion_actual_id

      const actaData = {
        aprendizId: aprendiz.id,
        formacionId: aprendiz.formacion_actual_id,
        actasId: [actaId + "-1", actaId + "-2", actaId + "-3"],
        nombre_directorio: actaId
      }

      await appAxios.post("/server/aprendices/uno", aprendiz)
      await appAxios.post("/server/aprendices-formaciones/uno", aprendicesFormaciones)
      await appAxios.post("/server/actas/todas-por-aprendiz", actaData)

      reset({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        contraseña: "",
        numeroIdentificacion: "",
        numeroFichaActual: "",
      })
    } catch (error: any) {
      console.log(error)
      setMensajeErrorBD(error.response.data)
    }
  })

  const noAplicarCambios = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const value = Object.entries(watch()).find(value => value[1])
    if (value) {
      reset({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        contraseña: "",
        numeroIdentificacion: "",
        numeroFichaActual: "",
      })
    }
  }

  const consultarFormacion = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const numeroFichaActual = watch().numeroFichaActual
    if (numeroFichaActual) {
      try {
        const { data } = await appAxios.get(`/server/formaciones/uno/${numeroFichaActual}`)
        setFormacionEncontrada(data)
        clearErrors("numeroFichaActual")
      } catch (error: any) {
        setError("numeroFichaActual", { message: "No existe esa formación con ese número de identificación", type: "validate" }, { shouldFocus: true })
        console.log("Error: ", error)
      }
    }
  }

  useEffect(() => {
    const conseguirFormacion = async () => {
      try {
        await appAxios.get(`/server/formaciones/uno/${formacionId}`)
        setExiteFormacion(true)
      } catch (error: any) {
        setExiteFormacion(false)
        console.log("Error: ", error)
      }
    }
    conseguirFormacion()
  }, [])

  useEffect(() => {
    setMensajeErrorBD(null)
  }, [watch().numeroIdentificacion, watch().numeroFichaActual, watch().email])

  useEffect(() => {
    setFormacionEncontrada(null)
    clearErrors("numeroFichaActual")
  }, [watch().numeroFichaActual])

  if (!exiteFormacion) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe esa formación</p>
      </div>
    )
  } else {
    return (
      <div className="grow flex flex-col items-center justify-center gap-4 w-full px-[20%] max-sm:px-4">
        <div className="w-full">
          <Title tamaño="grande" variante="lineaAbajo">Crear Aprendiz</Title>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 w-full max-w-[600px]">
          <div className="flex gap-4 w-full">
            <Input
              name="nombre"
              requerido={true}
              register={register} rules={{
                validate: (value) => {
                  const trimValue = value.trim()
                  if (!trimValue.length) return "Nombre requerido"
                  if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/g.test(trimValue)) return "Nombre deben ser letras";
                  if (trimValue.length < 3) return "Nombre debe tener almenos 3 caracteres";
                  if (trimValue.length > 49) return "Nombre no puede exceder los 50 caracteres";
                  return true;
                }
              }}
              errors={errors}
              label="Nombres"
            />
            <Input
              name="apellidos"
              requerido={true}
              register={register} rules={{
                validate: (value) => {
                  const trimValue = value.trim()
                  if (!trimValue.length) return "Apellidos requerido"
                  if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/g.test(trimValue)) return "Apellidos deben ser letras";
                  if (trimValue.length < 3) return "Apellidos debe tener almenos 3 caracteres";
                  if (trimValue.length > 49) return "Apellidos no puede exceder los 49 caracteres";
                  return true;
                }
              }}
              errors={errors}
              label="Apellidos"
            />
          </div>
          <Input
            name="numeroIdentificacion"
            requerido={true}
            register={register} rules={{
              validate: (value) => {
                const trimValue = value.trim()
                if (!trimValue.length) return "Número identificación requerido"
                if (!/^[0-9]+$/.test(trimValue)) return "Número identificación deben ser numeros";
                if (trimValue.length < 8) return "Número identificación debe tener almenos 8 caracteres";
                if (trimValue.length > 11) return "Número identificación no puede exceder los 11 caracteres";
                return true;
              }
            }}
            errors={errors}
            label="Número identificación"
          />
          <Input
            type="password"
            name="contraseña"
            requerido={true}
            register={register} rules={{
              validate: (value) => {
                const trimValue = value.trim()
                if (!trimValue.length) return "contraseña requerido"
                if (trimValue.length < 4) return "contraseña debe tener almenos 4 caracteres";
                if (trimValue.length > 49) return "contraseña no puede exceder los 50 caracteres";
                return true;
              }
            }}
            errors={errors}
            label="Contraseña"
          />
          <Input
            name="numeroFichaActual"
            requerido={true}
            register={register} rules={{
              validate: (value) => {
                const trimValue = value.trim()
                if (!trimValue.length) return "Número ficha actual requerido"
                if (!/^[0-9]+$/.test(trimValue)) return "Número ficha actual deben ser numeros";
                if (trimValue.length < 4) return "Número ficha actual debe tener almenos 4 números";
                if (trimValue.length > 11) return "Número ficha actual no puede exceder los 11 números";
                return true;
              }
            }}
            errors={errors}
            label="Número ficha actual"
            button="Buscar"
            buttonVariante='primario'
            buttonOnclick={consultarFormacion}
          />
          {formacionEncontrada && <p className="w-full text-sm font-light">{formacionEncontrada.nombre} - {formacionEncontrada.nombre_municipio}</p>}
          {/* {formacionEncontrada === null && <p className="w-full text-sm font-light text-red-500">No existe esa formación con ese número de identificación</p>} */}
          <div className="w-full flex gap-4">
            <Input
              name="telefono"
              requerido={false}
              register={register} rules={{
                validate: (value) => {
                  if (!value) return true
                  const trimValue = value.trim()
                  if (!/^[0-9]+$/.test(trimValue)) return "Telefono deben ser numeros";
                  if (trimValue.length < 10 || trimValue.length > 10) return "Telefono debe ser de 10 numeros";
                  return true;
                }
              }}
              errors={errors}
              label="Telefono"
            />
            <Input
              name="email"
              requerido={false}
              register={register} rules={{
                validate: (value) => {
                  if (!value) return true
                  const trimValue = value.trim()
                  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(trimValue)) return "Email no valido";
                  if (trimValue.length > 49) return "Email no puede exceder los 50 caracteres";
                  return true;
                }
              }}
              errors={errors}
              label="Email"
            />

          </div>
          {mensajeErrorBD && <p className="w-full text-red-500">{mensajeErrorBD}</p>}
          <div className="flex gap-2 w-full mt-4">
            <Button variante="primario">Crear</Button>
            <Button onClick={noAplicarCambios} variante="peligro">Cancelar</Button>
          </div>
        </form>
      </div>
    )
  }
}
