import { useForm } from "react-hook-form";
import { Input } from "../componentes/base/Input";
import { Title } from "../componentes/base/Title";
import { Button } from "../componentes/base/Button";
import { useContext, useEffect, useState } from "react";
import { AprendizType, FormacionType, JwtPayloadType } from "../../types";
import { useNavigate } from "react-router-dom";
import { appAxios } from "../../utils/axios";
import { hashContraseña } from "../../utils";
import { SessionContext } from "../context/SessionContext";

interface Props {
  aprendizData: AprendizType
}

export function PerfilAprendiz({ aprendizData }: Props) {
  const { userTipo, setSesionValue } = useContext(SessionContext)
  const navigation = useNavigate()
  const [aprendiz, setAprendiz] = useState<AprendizType>(aprendizData)
  const [editando, setEditando] = useState(false)
  const [formacionEncontrada, setFormacionEncontrada] = useState<FormacionType | null | undefined>(undefined)
  const [mensajeErrorBD, setMensajeErrorBD] = useState<string | null>("")
  // const [cargando, setCargando] = useState(true)
  const [cambiandoContraseña, setCambiandoContraseña] = useState(false)
  const { register, handleSubmit, formState: { errors, }, watch, reset, setValue, setError, clearErrors } = useForm()

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log("🚀 ~ onSubmit ~ formData:", formData)
      let hash_contraseña: string | null = null
      let nuevoHash_contraseña: string | null = null

      if (formData.contraseña) {
        hash_contraseña = await hashContraseña(formData.contraseña, aprendiz.salt)
        const contraseñaIgual = hash_contraseña === aprendiz.hash_contraseña;
        if (!contraseñaIgual) return setError("contraseña", { message: "Contraseña Incorrecta", type: "validate" })
        if (formData.nuevaContraseña !== formData.repetirContraseña) return setError("repetirContraseña", { message: "Las contraseña no es igual", type: "validate" })
      }

      if (formData.nuevaContraseña) {
        nuevoHash_contraseña = await hashContraseña(formData.nuevaContraseña, aprendiz.salt)
        if (nuevoHash_contraseña) setAprendiz({ ...aprendiz, hash_contraseña: nuevoHash_contraseña })
      }

      const aprendizData: AprendizType = {
        id: formData.numeroIdentificacion,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email || null,
        formacion_actual_id: formData.numeroFichaActual,
        hash_contraseña: nuevoHash_contraseña || aprendiz.hash_contraseña,
        salt: aprendiz.salt,
        telefono: formData.telefono || null
      }

      if (userTipo === "aprendiz") {
        const { data } = await appAxios.put<JwtPayloadType>(`/server/aprendices/uno/${aprendiz.id}`, { actualizarToken: true, data: aprendizData })
        setSesionValue(data)
      } else {
        await appAxios.put(`/server/aprendices/uno/${aprendiz.id}`, { actualizarToken: false, data: aprendizData })
      }

      reset({ ...watch(), contraseña: "", nuevaContraseña: "", repetirContraseña: "" })
      setEditando(false)
      setCambiandoContraseña(false)

      if (formData.numeroIdentificacion !== aprendiz.id) {
        navigation(`/perfil/aprendiz/${formData.numeroIdentificacion}`)
      }
    } catch (error: any) {
      console.log(error)
      setMensajeErrorBD(error.response.data)
    }
  })

  const noAplicarCambios = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditando(false);
    setCambiandoContraseña(false);
    reset({
      nombre: aprendiz.nombre,
      apellidos: aprendiz.apellidos,
      email: aprendiz.email || '',
      telefono: aprendiz.telefono || '',
      numeroIdentificacion: aprendiz.id,
      numeroFichaActual: aprendiz.formacion_actual_id,
    })
  }

  const consultarFormacion = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const numeroFichaActual = watch().numeroFichaActual
    if (numeroFichaActual) {
      try {
        const { data } = await appAxios.get(`/server/formaciones/uno/${numeroFichaActual}`)
        setFormacionEncontrada(data)
        clearErrors("numeroFichaActual")
        console.log("🚀 ~ CrearAprendiz ~ data:", data)
      } catch (error: any) {
        console.log("Error: ", error)
        setError("numeroFichaActual", { message: "No existe esa formación con ese número de identificación", type: "validate" }, { shouldFocus: true })
      }
    }
  }

  const eliminarAprendiz = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await appAxios.delete(`/server/aprendices/uno/${aprendiz.id}`)
      setAprendiz({ ...aprendiz, id: "" })
    } catch (error: any) {
      console.log("Error : ", error)
      setMensajeErrorBD(error.response.data)
    }
  }

  useEffect(() => {
    setEditando(false)
    setCambiandoContraseña(false)
    // const conseguirAprendiz = async () => {
    //   try {
    //     const { data: aprendiz } = await appAxios.get<AprendizType>(`/server/aprendices/uno/${id}`);
    //     setAprendiz(aprendiz)
    //     setValue("nombre", aprendiz.nombre)
    //     setValue("apellidos", aprendiz.apellidos)
    //     setValue("email", aprendiz.email || '')
    //     setValue("telefono", aprendiz.telefono || '')
    //     setValue("numeroIdentificacion", aprendiz.id)
    //     setValue("numeroFichaActual", aprendiz.formacion_actual_id)
    //     setValue("contraseña", '')
    //     setValue("nuevaContraseña", '')
    //     setValue("repetirContraseña", '')
    //   } catch (error: any) {
    //     console.log(error)
    //   }
    // }
    // conseguirAprendiz()
    if (aprendizData) {
      setAprendiz(aprendizData)
      setValue("nombre", aprendizData.nombre)
      setValue("apellidos", aprendizData.apellidos)
      setValue("email", aprendizData.email || '')
      setValue("telefono", aprendizData.telefono || '')
      setValue("numeroIdentificacion", aprendizData.id)
      setValue("numeroFichaActual", aprendizData.formacion_actual_id)
      setValue("contraseña", '')
      setValue("nuevaContraseña", '')
      setValue("repetirContraseña", '')
    }

  }, [aprendizData])

  useEffect(() => {
    const conseguirFormacion = async () => {
      if (!aprendiz.id) return
      try {
        const { data: formacion } = await appAxios.get<FormacionType>(`/server/formaciones/uno/${aprendiz.formacion_actual_id}`);
        setFormacionEncontrada(formacion)
      } catch (error: any) {
        console.log(error)
      }
    }
    conseguirFormacion()
  }, [aprendiz])

  useEffect(() => {
    setMensajeErrorBD(null)
  }, [watch().numeroIdentificacion, watch().numeroFichaActual, watch().email])

  useEffect(() => {
    setFormacionEncontrada(undefined)
    clearErrors("numeroFichaActual")
  }, [watch().numeroFichaActual, watch().email])

  if (!aprendiz.id) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe ese aprendiz</p>
      </div>
    )
  } else {
    return (
      <div className="grow flex flex-col items-center justify-center gap-4 w-full px-[20%]">
        <div className="w-full">
          <Title tamaño="grande" variante="lineaAbajo">Perfil Aprendiz</Title>
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
          {userTipo == "admin" && (
            <Input
              disabled={!editando}
              name="numeroFichaActual"
              requerido={editando ? true : null}
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
              {...(editando ? {
                button: "Buscar",
                buttonVariante: 'primario',
                buttonOnclick: consultarFormacion
              } : {})}
            />
          )}
          {userTipo == "aprendiz" && !editando && (
            <Input
              name="numeroFichaActual"
              disabled={true}
              register={register}
              label="Número ficha actual"
            />
          )}
          {formacionEncontrada && userTipo == "admin" && <p className="w-full text-sm font-light">{formacionEncontrada.nombre} - {formacionEncontrada.nombre_municipio}</p>}
          {editando && !cambiandoContraseña && userTipo === "aprendiz" && <Button onClick={(e) => { e.preventDefault; setCambiandoContraseña(true) }} variante="peligro">Cambiar Contraseña</Button>}
          {editando && cambiandoContraseña && userTipo === "aprendiz" && <Button onClick={(e) => { e.preventDefault; setCambiandoContraseña(false) }} variante="peligro">Cancelar Cambiar contraseña</Button>}
          {editando && cambiandoContraseña && userTipo === "aprendiz" && (
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
              {userTipo === "admin" && <Button onClick={eliminarAprendiz} variante="peligro">Eliminar</Button>}
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
