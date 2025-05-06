import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { Input } from "./base/Input";
import { Select } from "./base/Select";
import { Button } from "./base/Button";
import { useNavigate } from "react-router-dom";

interface Props {
  register: UseFormRegister<any>;
  selectValues: string[]
  inputButtonOnClick: () => void
  crearRuta?: string
  crearButtonNombre?: string
}

export function Filtros({ register, selectValues, inputButtonOnClick, crearRuta, crearButtonNombre }: Props) {
  const navigation = useNavigate()

  return (
    <div className="flex justify-between items-center pt-4">
      <div className="w-full flex items-center gap-2">
        <div className="flex items-center max-w-96">
          <Select
            name="tipoFiltro"
            register={register}
            className="h-9"
            values={selectValues}
          />
          <span className="ml-2  text-lg">:</span>
        </div>
        <div className="max-w-96">
          <Input
            name="datoFiltro"
            register={register}
            button="Buscar"
            buttonOnclick={inputButtonOnClick}
          />
        </div>
      </div>
      <div className="">
        <Button onClick={() => navigation(crearRuta || '/')} variante="primario" className="w-max">{crearButtonNombre}</Button>
      </div>
    </div>
  )
}
