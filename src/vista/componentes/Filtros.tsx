import { UseFormRegister } from "react-hook-form";
import { Input } from "./base/Input";
import { Select } from "./base/Select";
import { Button } from "./base/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "../context/SessionContext";

interface Props {
  register: UseFormRegister<any>;
  selectValues: string[]
  inputButtonOnClick: () => void
  crearRuta?: string
  crearButtonNombre?: string
}

export function Filtros({ register, selectValues, inputButtonOnClick, crearRuta, crearButtonNombre }: Props) {
  const { userTipo } = useContext(SessionContext)
  const navigation = useNavigate()

  return (
    <div className="flex justify-between items-center pt-4 max-sm:flex-col  max-sm:gap-4">
      <div className="w-full flex items-center gap-2">
        <div className="flex items-center w-[20%] max-w-96 max-sm:w-[30%]">
          <Select
            name="tipoFiltro"
            register={register}
            className="h-9 w-full! max-sm:w-4"
            values={selectValues}
          />
          <span className="ml-2  text-lg">:</span>
        </div>
        <div className={userTipo == "admin" ? "w-[70%]" : "w-[80%]"}>
          <Input
            name="datoFiltro"
            register={register}
            button="Buscar"
            buttonOnclick={inputButtonOnClick}
          />
        </div>
      </div>
      {userTipo == "admin" && crearButtonNombre && (
        <div className="max-sm:w-full">
          <Button onClick={() => navigation(crearRuta || '/')} variante="primario" className="w-max max-sm:w-full">{crearButtonNombre}</Button>
        </div>
      )}

    </div>
  )
}
