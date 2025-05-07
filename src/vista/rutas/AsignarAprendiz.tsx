import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { Input } from "../componentes/base/Input"
import { Button } from "../componentes/base/Button"
import { appAxios } from "../../utils/axios"
import { useEffect, useState } from "react"
import { AprendizType, InstructoresAprendicesType, InstructorType } from "../../types"
import { Title } from "../componentes/base/Title"

export function AsignarAprendiz() {
  const { id: instructorId } = useParams()
  const { register, setValue, setError, formState: { errors }, clearErrors, watch, handleSubmit, reset } = useForm()
  const [instructorEncontrado, setInstructorEncontrado] = useState<InstructorType | null>(null)
  const [aprendizEncontrado, setAprendizEncontrado] = useState<AprendizType | null>(null)
  const [mensajeErrorBD, setMensajeErrorBD] = useState<string | null>(null)
  const [existeInstructor, setExisteInstructor] = useState(false)

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const instructoresAprendices: InstructoresAprendicesType = {
        aprendiz_id: formData.numeroIdentificacionAprendiz,
        instructor_id: formData.numeroIdentificacionInstructor,
        activa: true,
        id: formData.numeroIdentificacionInstructor + formData.numeroIdentificacionAprendiz
      }
      const { data: { formacion_actual_id } } = await appAxios.get<AprendizType>(`/server/aprendices/uno/${formData.numeroIdentificacionAprendiz}`)
      console.log("🚀 ~ onSubmit ~ formacion_actual_id:", formacion_actual_id)
      if (!formacion_actual_id) return setMensajeErrorBD("Este aprendiz no esta en una formación")
      await appAxios.post("/server/instructores-aprendices/uno", instructoresAprendices)
      reset({
        numeroIdentificacionAprendiz: "",
        numeroIdentificacionInstructor: instructorId
      })
      setInstructorEncontrado(null)
      setAprendizEncontrado(null)
    } catch (error: any) {
      console.log("Error: ", error)
      setMensajeErrorBD(error.response.data)
    }
  })

  const consultarInstructor = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault()
      const { data: instructor } = await appAxios.get<InstructorType>(`/server/instructores/uno/${watch().numeroIdentificacionInstructor}`)
      setInstructorEncontrado(instructor)
    } catch (error: any) {
      console.log("Error: ", error)
      setError("numeroIdentificacionInstructor", { type: "validate", message: "No existe un instructor con ese número" })
      setInstructorEncontrado(null)
    }
  }
  const consultarAprendiz = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault()
      const { data: aprendiz } = await appAxios.get<AprendizType>(`/server/aprendices/uno/${watch().numeroIdentificacionAprendiz}`)
      setAprendizEncontrado(aprendiz)
    } catch (error: any) {
      console.log("Error: ", error)
      setError("numeroIdentificacionAprendiz", { type: "validate", message: "No existe un aprendiz con ese número" })
      setAprendizEncontrado(null)
    }
  }

  useEffect(() => {
    clearErrors("numeroIdentificacionInstructor")
  }, [watch().numeroIdentificacionInstructor])

  useEffect(() => {
    setMensajeErrorBD(null)
  }, [watch().numeroIdentificacionAprendiz])

  useEffect(() => {
    clearErrors("numeroIdentificacionAprendiz")
  }, [watch().numeroIdentificacionInstructor, watch().numeroIdentificacionAprendiz])

  useEffect(() => {
    setValue("numeroIdentificacionInstructor", instructorId)
  }, [])

  useEffect(() => {
    const conseguirInstructor = async () => {
      try {
        await appAxios.get(`/server/instructores/uno/${instructorId}`)
        setExisteInstructor(true)
      } catch (error: any) {
        console.log("Errro: ", error)
        console.log("Debe llegar aqui")
        setExisteInstructor(false)
      }
    }
    conseguirInstructor()
  }, [instructorId])


  if (!existeInstructor) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe ese instructor</p>
      </div>
    )
  } else {
    return (
      <div className="grow flex flex-col items-center justify-center gap-4 w-full px-[20%]">
        <div className="w-full">
          <Title variante="lineaAbajo" tamaño="grande">Asignar Aprendiz</Title>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 w-full max-w-[600px]">
          <Input
            name="numeroIdentificacionInstructor"
            requerido={true}
            register={register} rules={{
              validate: (value) => {
                const trimValue = value.trim()
                if (!trimValue.length) return "Número identificación instructor requerido"
                if (!/^[0-9]+$/.test(trimValue)) return "Número identificación instructor deben ser numeros";
                if (trimValue.length < 4) return "Número identificación instructor debe tener almenos 4 números";
                if (trimValue.length > 11) return "Número identificación instructor no puede exceder los 11 números";
                return true;
              }
            }}
            errors={errors}
            label="Número identificación instructor"
            button="Buscar"
            buttonVariante='primario'
            buttonOnclick={consultarInstructor}
          />
          {instructorEncontrado && <p className="w-full text-sm font-light">{instructorEncontrado.nombre} {instructorEncontrado.apellidos}</p>}
          <Input
            name="numeroIdentificacionAprendiz"
            requerido={true}
            register={register} rules={{
              validate: (value) => {
                const trimValue = value.trim()
                if (!trimValue.length) return "Número identificación aprendiz requerido"
                if (!/^[0-9]+$/.test(trimValue)) return "Número identificación aprendiz deben ser numeros";
                if (trimValue.length < 4) return "Número identificación aprendiz debe tener almenos 4 números";
                if (trimValue.length > 11) return "Número identificación aprendiz no puede exceder los 11 números";
                return true;
              }
            }}
            errors={errors}
            label="Número identificación aprendiz"
            button="Buscar"
            buttonVariante='primario'
            buttonOnclick={consultarAprendiz}
          />
          {aprendizEncontrado && <p className="w-full text-sm font-light">{aprendizEncontrado.nombre} {aprendizEncontrado.apellidos}</p>}
          {mensajeErrorBD && <p className="w-full text-red-500">{mensajeErrorBD}</p>}
          <Button variante="primario">Asignar</Button>
        </form>
      </div>
    )
  }
}
