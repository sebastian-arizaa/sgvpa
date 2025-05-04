import { useForm } from "react-hook-form";
import { Input } from "../componentes/base/Input";
import { Title } from "../componentes/base/Title";
import { Button } from "../componentes/base/Button";
import { useState } from "react";
import { FormacionType } from "../../types";
import { Select } from "../componentes/base/Select";

export function PerfilFormacion() {
  const [editando, setEditando] = useState(false)
  // const [cargando, setCargando] = useState(true)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  let formacion: FormacionType = {
    nombre: "Desarollo de Software",
    id: "7896321",
    nombre_departamento: "Boyaca",
    nombre_municipio: "Veléz"
  }

  const onSubmit = handleSubmit(async (formData) => {
    console.log("🚀 ~ onSubmit ~ formData:", formData)
    setEditando(false)
  })

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

  return (
    <div className="grow flex flex-col items-center justify-center gap-4 w-full px-[20%]">
      <div className="w-full">
        <Title tamaño="grande" variante="lineaAbajo">Perfil Formación</Title>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 w-full max-w-[600px]">
        <Input
          defaultValue={formacion.nombre}
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
          label="Nombre formación"
        />
        <Input
          defaultValue={formacion.id}
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
          defaultValue={"Boyaca"}
          disabled={!editando}
          requerido={editando ? true : null}
          name="departamento"
          values={["Santander", "Boyaca", "Cundinamarca", "Antioquia"]}
          register={register}
          label="Departamento"
        />
        <Select
          disabled={!editando}
          requerido={editando ? true : null}
          name="municipio"
          values={["Barbosa", "Veléz", "Puente Nacional", "Bucaramanga"]}
          register={register}
          label="Municipio"
        />
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
