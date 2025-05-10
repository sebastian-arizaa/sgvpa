import { useEffect, useState } from "react";
import { FormacionType } from "../../types";
import { appAxios } from "../../utils/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Paginacion from "../componentes/Paginacion";
import { Filtros } from "../componentes/Filtros";
import { Button } from "../componentes/base/Button";

export function Formaciones() {
  const navigation = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [formaciones, setFormaciones] = useState<FormacionType[]>([])
  const [formacionesFiltradas, setFormacionesFiltradas] = useState<FormacionType[]>([])
  const [paginacion, setPaginacion] = useState({ inicio: 1, fin: 10 })
  const [renderizoPorParamentros, setRenderizoPorParamentros] = useState(false)
  const { register, handleSubmit, setValue } = useForm()

  useEffect(() => {
    setValue("tipoFiltro", searchParams.get("tipoFiltro") || "Por Nombre")
    setValue("datoFiltro", searchParams.get("datoFiltro") || "")
  }, [])


  const onClick = handleSubmit((data) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (data.tipoFiltro === "Por Nombre") {
      setFormacionesFiltradas(formaciones.filter(formaciones => formaciones.nombre.toLowerCase().includes(data.datoFiltro.toLowerCase())))
      newSearchParams.set("tipoFiltro", "Por Nombre")
      newSearchParams.set("datoFiltro", data.datoFiltro)
      setSearchParams(newSearchParams)
    } else {
      setFormacionesFiltradas(formaciones.filter(formaciones => formaciones.id.toLowerCase().includes(data.datoFiltro)))
      newSearchParams.set("tipoFiltro", "Por N. Identificación")
      newSearchParams.set("datoFiltro", data.datoFiltro)
      setSearchParams(newSearchParams)
    }
    setPaginacion({ inicio: 1, fin: 10 })
  })

  const renderizarFormaciones = () => {
    if (!formacionesFiltradas.length) return
    let paginacionInstructores: FormacionType[] = []
    for (let i = (paginacion.inicio - 1); i < (paginacion.fin); i++) {
      if (formacionesFiltradas[i]) {
        paginacionInstructores.push(formacionesFiltradas[i])
      } else {
        break;
      }
    }
    return paginacionInstructores.map(formacion => (
      <div
        key={formacion.id}
        onClick={() => navigation(`/perfil/formacion/${formacion.id}`)}
        className="flex gap-2 justify-between items-center shadow-md border-t-4 border-gray-200 p-2 cursor-pointer hover:bg-gray-200"
      >
        <p className="max-sm:w-[70%]">{formacion.nombre} - {formacion.nombre_municipio}</p>
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              navigation(`/aprendices/formacion/${formacion.id}`)
            }}
            variante="primario"
          >Ver Aprendices</Button>
        </div>
      </div>
    ))
  }

  useEffect(() => {
    const conseguirTodosFormaciones = async () => {
      try {
        const { data: formaciones } = await appAxios.get<FormacionType[]>("/server/formaciones/todos")
        const instructoresOrdenados = formaciones.sort(({ nombre: NombreA }, { nombre: nombreB }) => {
          if (NombreA.toLowerCase() < nombreB.toLowerCase()) return -1;
          if (NombreA.toLowerCase() > nombreB.toLowerCase()) return 1;
          return 0
        })
        setFormacionesFiltradas(instructoresOrdenados)
        setFormaciones(instructoresOrdenados)
      } catch (error: any) {
        console.log("Error: ", error)
      }
    }
    conseguirTodosFormaciones()
  }, [])

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ formacionesFiltradas:", formacionesFiltradas)
    if (formacionesFiltradas.length) {
      console.log("🚀 ~ useEffect ~ renderizoPorParamentros:", renderizoPorParamentros)
      const tipoFiltro = searchParams.get("tipoFiltro")
      const datoFiltro = searchParams.get("datoFiltro")
      if (!tipoFiltro) return
      if (!datoFiltro) return
      if (renderizoPorParamentros) return
      if (tipoFiltro === "Por Nombre") {
        setFormacionesFiltradas(formaciones.filter(formaciones => formaciones.nombre.toLowerCase().includes(datoFiltro)))
      } else {
        setFormacionesFiltradas(formaciones.filter(formaciones => formaciones.id.toLowerCase().includes(datoFiltro)))
      }
      setRenderizoPorParamentros(true)
      setPaginacion({ inicio: 1, fin: 10 })
    }
  }, [formacionesFiltradas])

  return (
    <div className="grow flex flex-col gap-4 w-full px-[20%] max-lg:px-4">
      <Filtros
        register={register}
        inputButtonOnClick={onClick}
        selectValues={["Por Nombre", "Por N. Identificación"]}
        crearRuta="/crear/formacion"
        crearButtonNombre="Crear formaciones"
      />
      <div className="flex flex-col gap-4 w-full py-4 border-t border-gray-200">
        {renderizarFormaciones()}
      </div>
      <Paginacion paginacion={paginacion} setPaginacion={setPaginacion} data={formacionesFiltradas} />
    </div>
  )
}
