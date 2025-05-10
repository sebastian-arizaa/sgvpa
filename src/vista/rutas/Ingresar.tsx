import { useForm } from "react-hook-form";
import { Button } from "../componentes/base/Button";
import { Input } from "../componentes/base/Input";
import { Title } from "../componentes/base/Title";
import { appAxios } from "../../utils/axios";
import { JwtPayloadType } from "../../types";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../context/SessionContext";

export function Ingresar() {
  const { setSesionValue } = useContext(SessionContext)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [userError, setUserError] = useState<string | null>(null)

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const perfilRutaDB = formData.perfil.split("|")[0]
      const { data } = await appAxios.post<JwtPayloadType>(`/server/${perfilRutaDB}/ingresar`, { id: formData.numeroIdentificacion, contraseña: formData.contraseña })
      setSesionValue(data)
    } catch (error: any) {
      console.log("🚀 ~ onSubmit ~ error:", error)
      if (error.code === "ERR_NETWORK") return setUserError("Error en la conexion con el servidor")
      setUserError("Número de identificación o contraseña incorrectos")
    }
  })

  const isChecked = (value: string) => {
    if (!watch().perfil) if (value === "aprendices|aprendiz") return true
    if (value === watch().perfil) return true
    return false
  }

  useEffect(() => {
    setUserError(null)
  }, [watch().numeroIdentificacion, watch().contraseña, watch().perfil])

  return (
    <div className="grow flex flex-col items-center justify-center gap-4 w-full px-[20%] max-sm:px-4">
      <div className="w-full">
        <Title variante="lineaAbajo" tamaño="grande">Ingresar</Title>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 w-full max-w-[600px]">
        <div className="w-full flex items-center gap-4">
          <Input
            className="hidden"
            checked={isChecked("admins|admin")}
            name="perfil"
            type="radio"
            value="admins|admin"
            register={register}
            id="radioAdmin"
            label="Administrador"
            labelClassName={`text-center border-b-2 border-gray-300 pb-2 cursor-pointer hover:border-green-500 ${isChecked("admins|admin") ? " border-green-500" : ''}`}
          />
          <Input
            className="hidden"
            checked={isChecked("instructores|instructor")}
            required={undefined}
            name="perfil"
            type="radio"
            value="instructores|instructor"
            register={register}
            id="radioInstructor"
            label="Instructor"
            labelClassName={`text-center border-b-2 border-gray-300 pb-2 cursor-pointer hover:border-green-500 ${isChecked("instructores|instructor") ? " border-green-500" : ''}`}
          />
          <Input
            className="hidden"
            checked={isChecked("aprendices|aprendiz")}
            name="perfil"
            type="radio"
            value="aprendices|aprendiz"
            register={register}
            id="radioAprendiz"
            label="Aprendiz"
            labelClassName={`text-center border-b-2 border-gray-300 pb-2 cursor-pointer hover:border-green-500 ${isChecked("aprendices|aprendiz") ? " border-green-500" : ''}`}
          />
        </div>
        <Input
          name="numeroIdentificacion"
          register={register} rules={{
            validate: (value) => {
              const trimValue = value.trim()
              if (!trimValue.length) return "Número identificación requerido"
              if (!/^[0-9]+$/.test(trimValue)) return "Número identificación deben ser numeros";
              if (trimValue.length < 3) return "Número identificación debe tener almenos 8 caracteres";
              if (trimValue.length > 11) return "Número identificación no puede exceder los 11 caracteres";
              return true;
            }
          }}
          errors={errors}
          label="Número identificación"
        />
        <Input
          type="password"
          verCopiar={false}
          name="contraseña"
          register={register} rules={{
            validate: (value) => {
              const trimValue = value.trim()
              if (!trimValue.length) return "Contraseña requerida"
              if (trimValue.length < 3) return "Contraseña debe tener almenos 4 caracteres";
              if (trimValue.length > 20) return "Contraseña no puede exceder los 20 caracteres";
              return true;
            }
          }}
          errors={errors}
          label="Contraseña"
        />
        {userError && (
          <div className="w-full">
            <p className="text-red-500">{userError}</p>
          </div>
        )}
        <Button variante="primario">Ingresar</Button>
      </form>
    </div >
  )
}
