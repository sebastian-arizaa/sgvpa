import { useForm } from "react-hook-form";
import { Input } from "../componentes/base/Input";
import { Title } from "../componentes/base/Title";
import { Button } from "../componentes/base/Button";
import { useEffect, useState } from "react";
import { FormacionType } from "../../types";
import { Select } from "../componentes/base/Select";
import { useNavigate, useParams } from "react-router-dom";
import { appAxios } from "../../utils/axios";
import { useFetchDepartamentos } from "../hooks/useFetchDepartamentos";
import { useFetchMunicipios } from "../hooks/useFetchMunicipios";

export function PerfilFormacion() {
  const { id } = useParams()
  const navigation = useNavigate()
  const [formacion, setFormacion] = useState<FormacionType>({
    nombre: "",
    id: "",
    nombre_departamento: "",
    nombre_municipio: ""
  })
  const [editando, setEditando] = useState(false)
  // const [cargando, setCargando] = useState(true)
  const [mensajeErrorBD, setMensajeErrorBD] = useState<string | null>("")
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm()
  const [departamentos] = useFetchDepartamentos()
  const { municipios } = useFetchMunicipios({ departamentoActual: watch().departamento })
  console.log("🚀 ~ PerfilFormacion ~ municipios:", municipios)

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log("🚀 ~ onSubmit ~ formData:", formData)
      const formacionData: FormacionType = {
        nombre: formData.nombre,
        id: formData.numeroFicha,
        nombre_departamento: formData.departamento,
        nombre_municipio: formData.municipio
      }
      console.log("🚀 ~ onSubmit ~ formacionData:", formacionData)
      await appAxios.put(`/server/formaciones/uno/${formacion.id}`, formacionData)
      reset({ ...watch() })
      setEditando(false)
      if (formData.numeroFicha !== id) {
        navigation(`/perfil/formacion/${formData.numeroFicha}`)
      }
    } catch (error: any) {
      console.log(error)
      setMensajeErrorBD(error.response.data)
    }
  })

  const eliminarFormacion = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await appAxios.delete(`/server/formaciones/uno/${formacion.id}`)
      setFormacion({ ...formacion, id: "" })
    } catch (error: any) {
      console.log("Error : ", error)
      setMensajeErrorBD(error.response.data)
    }
  }

  const noAplicarCambios = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditando(false);
    reset({
      nombre: formacion.nombre,
      numeroFicha: formacion.id,
      departamento: formacion.nombre_departamento,
      municipio: formacion.nombre_municipio
    })
  }

  useEffect(() => {
    setEditando(false)
    const conseguirInstructor = async () => {
      try {
        const { data: formacion } = await appAxios.get<FormacionType>(`/server/formaciones/uno/${id}`)
        console.log("🚀 ~ conseguirInstructor ~ data:", formacion)
        setFormacion(formacion)
        setValue("nombre", formacion.nombre)
        setValue("numeroFicha", formacion.id)
        setValue("departamento", "Santander")
        setValue("municipio", formacion.nombre_municipio)
      } catch (error: any) {
        console.log("Error: ", error)
      }
    }
    conseguirInstructor()
  }, [id, departamentos])

  useEffect(() => {
    setMensajeErrorBD(null)
  }, [watch().numeroFicha])

  if (!formacion.id) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe esa formación</p>
      </div>
    )
  } else {
    return (
      <div className="grow flex flex-col items-center justify-center gap-4 w-full px-[20%] max-sm:px-4">
        <div className="w-full">
          <Title tamaño="grande" variante="lineaAbajo">Perfil Formación</Title>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 w-full max-w-[600px]">
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
                if (trimValue.length > 100) return "Nombre no puede exceder los 100 caracteres";
                return true;
              }
            }}
            errors={errors}
            label="Nombre formación"
          />
          <Input
            disabled={!editando}
            name="numeroFicha"
            requerido={editando ? true : null}
            register={register} rules={{
              validate: (value) => {
                const trimValue = value.trim()
                if (!trimValue.length) return "numeroFicha identificación requerido"
                if (!/^[0-9]+$/.test(trimValue)) return "numeroFicha identificación deben ser numeros";
                if (trimValue.length < 4) return "numeroFicha identificación debe tener almenos 8 caracteres";
                if (trimValue.length > 11) return "numeroFicha identificación no puede exceder los 11 caracteres";
                return true;
              }
            }}
            errors={errors}
            label="Número ficha"
          />
          <Select
            // defaultValue={formacion.nombre_departamento}
            disabled={!editando}
            requerido={editando ? true : null}
            name="departamento"
            values={[...departamentos]}
            register={register}
            label="Departamento"
          />
          <Select
            // defaultValue={formacion.nombre_municipio}
            disabled={!editando}
            requerido={editando ? true : null}
            name="municipio"
            values={[...municipios]}
            register={register}
            label="Municipio"
          />
          {mensajeErrorBD && <p className="w-full text-red-500">{mensajeErrorBD}</p>}
          {!editando && (
            <div className="flex gap-2 w-full mt-4">
              <Button onClick={(e) => { e.preventDefault; setEditando(true) }} variante="primario">Editar</Button>
              <Button onClick={eliminarFormacion} variante="peligro">Eliminar</Button>
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
