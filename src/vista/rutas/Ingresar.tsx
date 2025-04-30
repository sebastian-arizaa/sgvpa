import { useForm } from "react-hook-form";
import { Button } from "../componentes/base/Button";
import { Input } from "../componentes/base/Input";
import { Title } from "../componentes/base/Title";
import { Subtitle } from "../componentes/base/Subtitle";

export function Ingresar() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const onSubmit = handleSubmit((data) => {
    console.log("Funciona")
    console.log(data)
  })


  const isChecked = (value: string) => {
    console.log(watch())
    if (!watch().perfil) if (value === "aprendiz") return true
    if (value === watch().perfil) return true
    return false
  }
  // console.log(errors)

  return (
    <div>
      <div className="w-1/2">
        <Title variante="lineaAbajo" tamaño="grande">Ingresar mi rey</Title>
      </div>
      <div className="w-1/2">
        <Subtitle variante="lineaAbajo" tamaño="grande">Hello!</Subtitle>
      </div>
      <div className="flex gap-4 pl-12 w-[1000px]">
        <Button variante="secundario">Anterior</Button>
        <Button variante="secundario">Siguiente</Button>
      </div>
      <form onSubmit={onSubmit} className="w-1/2 mt-16 pl-4">
        <Input
          name="nombre"
          register={register} rules={{
            validate: (value) => {
              const trimValue = value.trim()
              if (!trimValue.length) return "Nombre requerido"
              if (!/^[A-Za-z ]+$/.test(trimValue)) return "Ingresa un nombre valido";
              if (trimValue.length < 3) return "Nombre debe tener almenos 3 caracteres";
              if (trimValue.length > 20) return "Nombre no puede exceder los 20 caracteres";
              return true;
            }
          }}
          errors={errors}
        />
        <Button variante="primario">Presionar</Button>


        <div className="flex items-center gap-4">
          <Input
            className="hidden"
            checked={isChecked("admin")}
            name="perfil"
            type="radio"
            value="admin"
            register={register}
            id="radioAdmin"
            label="Administrador"
            labelClassName={`border-b-2 border-gray-300 pb-2 cursor-pointer ${isChecked("admin") ? "border-b-2 border-green-500" : ''}`}
          />
          <Input
            className="hidden"
            checked={isChecked("instructor")}
            name="perfil"
            type="radio"
            value="instructor"
            register={register}
            id="radioInstructor"
            label="Instructor"
            labelClassName={`border-b-2 border-gray-300 pb-2 cursor-pointer ${isChecked("instructor") ? "border-b-2 border-green-500" : ''}`}
          />
          <Input
            className="hidden"
            checked={isChecked("aprendiz")}
            name="perfil"
            type="radio"
            value="aprendiz"
            register={register}
            id="radioAprendiz"
            label="Aprendiz"
            labelClassName={`border-b-2 border-gray-300 pb-2 cursor-pointer ${isChecked("aprendiz") ? "border-b-2 border-green-500" : ''}`}
          />
        </div>
      </form>

    </div>
  )
}
