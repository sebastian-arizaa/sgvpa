import { useEffect, useState } from "react";
import { InnerAprendizFormacionType } from "../../types";
import { appAxios } from "../../utils/axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Paginacion from "../componentes/Paginacion";
import { Filtros } from "../componentes/Filtros";
import { Button } from "../componentes/base/Button";

export function Aprendices() {
  const { id: formacionId } = useParams()
  const navigation = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [aprendices, setAprendices] = useState<InnerAprendizFormacionType[]>([])
  const [aprendicesFiltrados, setAprendicesFiltrados] = useState<InnerAprendizFormacionType[]>([])
  const [paginacion, setPaginacion] = useState({ inicio: 1, fin: 10 })
  const [renderizoPorParamentros, setRenderizoPorParamentros] = useState(false)
  const [exiteFormacion, setExiteFormacion] = useState(false)
  console.log("🚀 ~ Aprendices ~ o:", exiteFormacion)
  const { register, handleSubmit, setValue } = useForm()

  setValue("tipoFiltro", searchParams.get("tipoFiltro") || "Por Nombre")
  setValue("datoFiltro", searchParams.get("datoFiltro") || "")

  const onClick = handleSubmit((data) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (data.tipoFiltro === "Por Nombre") {
      setAprendicesFiltrados(aprendices.filter(aprendices => aprendices.nombre.toLowerCase().includes(data.datoFiltro.toLowerCase())))
      newSearchParams.set("tipoFiltro", "Por Nombre")
      newSearchParams.set("datoFiltro", data.datoFiltro)
      setSearchParams(newSearchParams)
    } else {
      setAprendicesFiltrados(aprendices.filter(aprendices => aprendices.id.toLowerCase().includes(data.datoFiltro)))
      newSearchParams.set("tipoFiltro", "Por N. Identificación")
      newSearchParams.set("datoFiltro", data.datoFiltro)
      setSearchParams(newSearchParams)
    }
    setPaginacion({ inicio: 1, fin: 10 })
  })

  const renderizarAprendices = () => {
    if (!aprendicesFiltrados.length) return
    let paginacionInstructores: InnerAprendizFormacionType[] = []
    for (let i = (paginacion.inicio - 1); i < (paginacion.fin); i++) {
      if (aprendicesFiltrados[i]) {
        paginacionInstructores.push(aprendicesFiltrados[i])
      } else {
        break;
      }
    }
    return paginacionInstructores.map(aprendiz => (
      <div
        key={aprendiz.id}
        onClick={() => navigation(`/perfil/aprendiz/${aprendiz.id}`,)}
        className="flex gap-2 justify-between items-center shadow-md border-t-4 border-gray-200 p-2 cursor-pointer hover:bg-gray-200"
      >
        <p className="max-sm:w-[70%]">{aprendiz.nombre} {aprendiz.apellidos}</p>
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              navigation(`/aprendiz/actas/${aprendiz.id}`)
            }}
            variante="primario"
          >Ver Actas</Button>
        </div>
      </div>
    ))
  }

  useEffect(() => {
    const conseguirFormacion = async () => {
      try {
        await appAxios.get(`/server/formaciones/uno/${formacionId}`)
        setExiteFormacion(true)
      } catch (error: any) {
        setExiteFormacion(false)
        console.log("Error: ", error)
      }
    }
    conseguirFormacion()
  }, [])

  useEffect(() => {
    if (!exiteFormacion) return
    const conseguirTodosInstructores = async () => {
      try {
        const { data: aprendices } = await appAxios.get<InnerAprendizFormacionType[]>(`/server/aprendices/todos-por-formacion/${formacionId}`)
        const instructoresOrdenados = aprendices.sort(({ nombre: NombreA }, { nombre: nombreB }) => {
          if (NombreA.toLowerCase() < nombreB.toLowerCase()) return -1;
          if (NombreA.toLowerCase() > nombreB.toLowerCase()) return 1;
          return 0
        })
        setAprendicesFiltrados(instructoresOrdenados)
        setAprendices(instructoresOrdenados)
      } catch (error: any) {
        console.log("Error: ", error)
      }
    }
    conseguirTodosInstructores()
  }, [exiteFormacion])

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ aprendicesFiltrados:", aprendicesFiltrados)
    if (aprendicesFiltrados.length) {
      console.log("🚀 ~ useEffect ~ renderizoPorParamentros:", renderizoPorParamentros)
      const tipoFiltro = searchParams.get("tipoFiltro")
      const datoFiltro = searchParams.get("datoFiltro")
      if (!tipoFiltro) return
      if (!datoFiltro) return
      if (renderizoPorParamentros) return
      if (tipoFiltro === "Por Nombre") {
        setAprendicesFiltrados(aprendices.filter(aprendices => aprendices.nombre.toLowerCase().includes(datoFiltro)))
      } else {
        setAprendicesFiltrados(aprendices.filter(aprendices => aprendices.id.toLowerCase().includes(datoFiltro)))
      }
      setRenderizoPorParamentros(true)
      setPaginacion({ inicio: 1, fin: 10 })
    }
  }, [aprendicesFiltrados])

  if (!exiteFormacion) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe esa formación</p>
      </div>
    )
  } else {
    return (
      <div className="grow flex flex-col gap-4 w-full px-[20%]  max-lg:px-4">
        <Filtros
          register={register}
          inputButtonOnClick={onClick}
          selectValues={["Por Nombre", "Por N. Identificación"]}
          crearRuta={`/crear/aprendiz/${formacionId}`}
          crearButtonNombre="Crear aprendices"
        />
        <div className="flex flex-col gap-4 w-full py-4 border-t border-gray-200">
          {renderizarAprendices()}
        </div>
        <Paginacion paginacion={paginacion} setPaginacion={setPaginacion} data={aprendicesFiltrados} />
      </div>
    )
  }
}
