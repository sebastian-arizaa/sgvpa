import { useForm } from "react-hook-form";
import { Input } from "../componentes/base/Input";
import { Title } from "../componentes/base/Title";
import { Button } from "../componentes/base/Button";
import { useState } from "react";
import { AprendizType } from "../../types";

export function PerfilAprendiz() {
  const [editando, setEditando] = useState(false)
  // const [cargando, setCargando] = useState(true)
  const [cambiandoContraseña, setCambiandoContraseña] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm()

  let aprendiz: AprendizType = {
    nombre: "Sebastian",
    apellidos: "Ariza Diaz",
    email: "sebadia1333@gmail.edu.co",
    formacion_actual_id: "213813",
    hash_contraseña: "",
    id: "1027524106",
    salt: "",
    telefono: "3222594446"
  }

  const onSubmit = handleSubmit(async (formData) => {
    console.log("🚀 ~ onSubmit ~ formData:", formData)
    reset({ ...watch(), contraseña: "", nuevaContraseña: "", repetirContraseña: "" })
    setEditando(false)
    setCambiandoContraseña(false)
  })

  const noAplicarCambios = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditando(false);
    setCambiandoContraseña(false);
    reset({
      nombre: aprendiz.nombre,
      apellidos: aprendiz.apellidos,
      email: aprendiz.email,
      telefono: aprendiz.telefono,
      numeroIdentificacion: aprendiz.id,
      numeroFichaActual: aprendiz.formacion_actual_id,
    })
  }

  return (
    <div className="grow flex flex-col items-center justify-center gap-4 w-full px-[20%]">
      <div className="w-full">
        <Title tamaño="grande" variante="lineaAbajo">Perfil Aprendiz</Title>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 w-full max-w-[600px]">
        <div className="flex gap-4 w-full">
          <Input
            defaultValue={aprendiz.nombre}
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
            defaultValue={aprendiz.apellidos}
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
          defaultValue={aprendiz.id}
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
        <Input
          defaultValue={aprendiz.formacion_actual_id}
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
            buttonOnclick: (e) => {
              e.preventDefault();
              console.log("Buscar")
            }
          } : {})}
        />
        {true && <p className="w-full text-sm font-light">Tecnico en desarrollo de Sofware - Puente Nacional</p>}
        {editando && !cambiandoContraseña && <Button onClick={(e) => { e.preventDefault; setCambiandoContraseña(true) }} variante="peligro">Cambiar Contraseña</Button>}
        {editando && cambiandoContraseña && <Button onClick={(e) => { e.preventDefault; setCambiandoContraseña(false) }} variante="peligro">Cancelar Cambiar contraseña</Button>}
        {editando && cambiandoContraseña && (
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
            defaultValue={aprendiz.telefono}
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
            defaultValue={aprendiz.email}
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
        {!editando && <Button onClick={(e) => { e.preventDefault; setEditando(true) }} variante="primario">Editar</Button>}
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
