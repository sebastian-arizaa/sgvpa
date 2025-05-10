import { useForm } from "react-hook-form";
import { Input } from "../componentes/base/Input";
import { Title } from "../componentes/base/Title";
import { Button } from "../componentes/base/Button";
import { useContext, useEffect, useState } from "react";
import { InstructorType } from "../../types";
import { hashContraseña } from "../../utils";
import { appAxios } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";

interface Props {
  instructorData: InstructorType
}

export function PerfilInstructor({ instructorData }: Props) {
  const { userTipo, setSesionValue } = useContext(SessionContext)
  const navigation = useNavigate()
  const [instructor, setInstructor] = useState<InstructorType>(instructorData)
  const [editando, setEditando] = useState(false)
  // const [cargando, setCargando] = useState(true)
  const [mensajeErrorBD, setMensajeErrorBD] = useState<string | null>("")
  const [cambiandoContraseña, setCambiandoContraseña] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch, reset, setError, setValue } = useForm()

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log("🚀 ~ onSubmit ~ formData:", formData)
      let hash_contraseña: string | null = null
      let nuevoHash_contraseña: string | null = null

      if (formData.contraseña) {
        hash_contraseña = await hashContraseña(formData.contraseña, instructor.salt)
        const contraseñaIgual = hash_contraseña === instructor.hash_contraseña;
        if (!contraseñaIgual) return setError("contraseña", { message: "Contraseña Incorrecta", type: "validate" })
        if (formData.nuevaContraseña !== formData.repetirContraseña) return setError("repetirContraseña", { message: "Las contraseña no es igual", type: "validate" })
      }

      if (formData.nuevaContraseña) {
        nuevoHash_contraseña = await hashContraseña(formData.nuevaContraseña, instructor.salt)
        if (nuevoHash_contraseña) setInstructor({ ...instructor, hash_contraseña: nuevoHash_contraseña })
      }

      const instructorData: InstructorType = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email || null,
        telefono: formData.telefono || null,
        id: formData.numeroIdentificacion,
        hash_contraseña: nuevoHash_contraseña || instructor.hash_contraseña,
        salt: instructor.salt
      }

      if (userTipo === "instructor") {
        const { data } = await appAxios.put(`/server/instructores/uno/${instructor.id}`, { actualizarToken: true, data: instructorData })
        setSesionValue(data)
      } else {
        await appAxios.put(`/server/instructores/uno/${instructor.id}`, { actualizarToken: false, data: instructorData })
      }

      reset({ ...watch(), contraseña: "", nuevaContraseña: "", repetirContraseña: "" })
      setEditando(false)
      setCambiandoContraseña(false)
      if (formData.numeroIdentificacion !== instructor.id) {
        navigation(`/perfil/instructor/${formData.numeroIdentificacion}`)
      }
    } catch (error: any) {
      console.log(error)
      setMensajeErrorBD(error.response.data)
    }
  })

  const eliminarInstructor = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await appAxios.delete(`/server/instructores/uno/${instructor.id}`)
      setInstructor({ ...instructor, id: "" })
    } catch (error: any) {
      console.log("Error : ", error)
      setMensajeErrorBD(error.response.data)
    }
  }

  const noAplicarCambios = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditando(false);
    setCambiandoContraseña(false);
    reset({
      nombre: instructor.nombre,
      apellidos: instructor.apellidos,
      email: instructor.email || '',
      telefono: instructor.telefono || '',
      numeroIdentificacion: instructor.id,
    })
  }

  useEffect(() => {
    setEditando(false)
    setCambiandoContraseña(false)
    const conseguirInstructor = async () => {
      if (instructorData) {
        setInstructor(instructorData)
        setValue("nombre", instructorData.nombre)
        setValue("apellidos", instructorData.apellidos)
        setValue("email", instructorData.email || '')
        setValue("telefono", instructorData.telefono || '')
        setValue("numeroIdentificacion", instructorData.id)
        setValue("contraseña", '')
        setValue("nuevaContraseña", '')
        setValue("repetirContraseña", '')
      }
    }
    conseguirInstructor()
  }, [instructorData])

  useEffect(() => {
    setMensajeErrorBD(null)
  }, [watch().numeroIdentificacion, watch().email])

  if (!instructor.id) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe ese instructor</p>
      </div>
    )
  } else {
    return (
      <div className="grow flex flex-col items-center justify-center gap-4 w-full px-[20%] max-sm:px-4">
        <div className="w-full">
          <Title tamaño="grande" variante="lineaAbajo">Perfil Instructor</Title>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 w-full max-w-[600px]">
          <div className="flex gap-4 w-full">
            <Input
              disabled={!editando}
              name="nombre"
              requerido={editando ? true : null}
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
              disabled={!editando}
              name="apellidos"
              requerido={editando ? true : null}
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
            disabled={!editando}
            name="numeroIdentificacion"
            requerido={editando ? true : null}
            register={register} rules={{
              validate: (value) => {
                const trimValue = value.trim()
                if (!trimValue.length) return "Número identificación requerido"
                if (!/^[0-9]+$/.test(trimValue)) return "Número identificación deben ser numeros";
                if (trimValue.length < 4) return "Número identificación debe tener almenos 8 caracteres";
                if (trimValue.length > 11) return "Número identificación no puede exceder los 11 caracteres";
                return true;
              }
            }}
            errors={errors}
            label="Número identificación"
          />
          {editando && !cambiandoContraseña && userTipo === "instructor" && <Button onClick={(e) => { e.preventDefault; setCambiandoContraseña(true) }} variante="peligro">Cambiar Contraseña</Button>}
          {editando && cambiandoContraseña && userTipo === "instructor" && <Button onClick={(e) => { e.preventDefault; setCambiandoContraseña(false) }} variante="peligro">Cancelar Cambiar contraseña</Button>}
          {editando && cambiandoContraseña && userTipo === "instructor" && (
            <>
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
                type="password"
                name="nuevaContraseña"
                requerido={true}
                register={register} rules={{
                  validate: (value) => {
                    const trimValue = value.trim()
                    if (!trimValue.length) return "nueva contraseña requerido"
                    if (trimValue.length < 4) return "nueva contraseña debe tener almenos 4 caracteres";
                    if (trimValue.length > 49) return "nueva contraseña no puede exceder los 50 caracteres";
                    return true;
                  }
                }}
                errors={errors}
                label="Nueva contraseña"
              />
              <Input
                type="password"
                name="repetirContraseña"
                requerido={true}
                register={register} rules={{
                  validate: (value) => {
                    const trimValue = value.trim()
                    if (!trimValue.length) return "Repetir contraseña requerido"
                    if (trimValue.length < 4) return "repetir contraseña debe tener almenos 4 caracteres";
                    if (trimValue.length > 49) return "repetir contraseña no puede exceder los 50 caracteres";
                    return true;
                  }
                }}
                errors={errors}
                label="Repetir Contraseña"
              />
            </>
          )}
          <div className="w-full flex gap-4">
            <Input
              disabled={!editando}
              name="telefono"
              requerido={editando ? false : null}
              register={register} rules={{
                validate: (value) => {
                  const trimValue = value.trim()
                  if (!trimValue) return true
                  if (!/^[0-9]+$/.test(trimValue)) return "Telefono deben ser numeros";
                  if (trimValue.length < 10 || trimValue.length > 10) return "Telefono debe ser de 10 numeros";
                  return true;
                }
              }}
              errors={errors}
              label="Telefono"
            />
            <Input
              disabled={!editando}
              name="email"
              requerido={editando ? false : null}
              register={register} rules={{
                validate: (value) => {
                  const trimValue = value.trim()
                  if (!trimValue) return true
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
          {!editando && (
            <div className="flex gap-2 w-full mt-4">
              <Button onClick={(e) => { e.preventDefault; setEditando(true) }} variante="primario">Editar</Button>
              {userTipo === "admin" && <Button onClick={eliminarInstructor} variante="peligro">Eliminar</Button>}
            </div>
          )}
          {editando && (
            <div className="flex gap-2 w-full mt-4">
              <Button variante="primario">Aplicar Cambios</Button>
              <Button onClick={noAplicarCambios} variante="peligro">Descartar Cambios</Button>
            </div>
          )}
        </form>
      </div>
    )
  }
}
