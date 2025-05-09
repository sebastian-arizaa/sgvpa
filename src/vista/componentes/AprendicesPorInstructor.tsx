import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { appAxios } from "../../utils/axios"
import { Filtros } from "../componentes/Filtros"
import { useForm } from "react-hook-form"
import { InnerAprendizInstructorFormacionType } from "../../types"
import { Button } from "../componentes/base/Button"
import Paginacion from "../componentes/Paginacion"

interface Props {
  instructorId: string | undefined
}

export function AprendicesPorInstructor({ instructorId }: Props) {
  const { register, handleSubmit, setValue } = useForm()
  const [existeInstructor, setExisteInstructor] = useState(false)
  const navigation = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [aprendices, setAprendices] = useState<InnerAprendizInstructorFormacionType[]>([])
  const [aprendicesFiltrados, setAprendicesFiltrados] = useState<InnerAprendizInstructorFormacionType[]>([])
  const [renderizoPorParamentros, setRenderizoPorParamentros] = useState(false)
  const [paginacion, setPaginacion] = useState({ inicio: 1, fin: 10 })

  const onClick = handleSubmit((data) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (data.tipoFiltro === "Por Nombre") {
      setAprendicesFiltrados(aprendices.filter(aprendices => (aprendices.nombre.toLowerCase() + " " + aprendices.apellidos.toLowerCase()).includes(data.datoFiltro)))
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
    let paginacionAprendices: InnerAprendizInstructorFormacionType[] = []
    for (let i = (paginacion.inicio - 1); i < (paginacion.fin); i++) {
      if (aprendicesFiltrados[i]) {
        paginacionAprendices.push(aprendicesFiltrados[i])
      } else {
        break;
      }
    }
    return paginacionAprendices.map(aprendiz => (
      <div
        key={aprendiz.id}
        onClick={() => navigation(`/perfil/aprendiz/${aprendiz.id}`,)}
        className="flex gap-2 justify-between items-center shadow-md border-t-4 border-gray-200 p-2 cursor-pointer hover:bg-gray-200"
      >
        <p>{aprendiz.nombre} {aprendiz.apellidos}</p>
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              navigation(`/aprendiz/actas/${aprendiz.id}`, { relative: "route" },)
            }}
            variante="primario"
          >Ver Actas</Button>
        </div>
      </div>
    ))
  }

  useEffect(() => {
    setValue("tipoFiltro", searchParams.get("tipoFiltro") || "Por Nombre")
    setValue("datoFiltro", searchParams.get("datoFiltro") || "")
  }, [])

  useEffect(() => {
    if (aprendicesFiltrados.length) {
      const tipoFiltro = searchParams.get("tipoFiltro")
      const datoFiltro = searchParams.get("datoFiltro")
      if (!tipoFiltro) return
      if (!datoFiltro) return
      if (renderizoPorParamentros) return
      if (tipoFiltro === "Por Nombre") {
        setAprendicesFiltrados(aprendices.filter(aprendices => (aprendices.nombre.toLowerCase() + " " + aprendices.apellidos.toLowerCase()).includes(datoFiltro)))
      } else {
        setAprendicesFiltrados(aprendices.filter(aprendices => aprendices.id.toLowerCase().includes(datoFiltro)))
      }
      setRenderizoPorParamentros(true)
      setPaginacion({ inicio: 1, fin: 10 })
    }
  }, [aprendicesFiltrados])

  useEffect(() => {
    if (!existeInstructor) return
    const conseguirTodosInstructores = async () => {
      try {
        const { data: aprendices } = await appAxios.get<InnerAprendizInstructorFormacionType[]>(`/server/aprendices/todos-por-instructor/${instructorId}`)
        const aprendicesOrdenados = aprendices.sort(({ nombre: NombreA }, { nombre: nombreB }) => {
          if (NombreA.toLowerCase() < nombreB.toLowerCase()) return -1;
          if (NombreA.toLowerCase() > nombreB.toLowerCase()) return 1;
          return 0
        })
        setAprendicesFiltrados(aprendicesOrdenados)
        setAprendices(aprendicesOrdenados)
      } catch (error: any) {
        console.log("Error: ", error)
      }
    }
    conseguirTodosInstructores()
  }, [existeInstructor])

  useEffect(() => {
    const conseguirInstructor = async () => {
      try {
        await appAxios.get(`/server/instructores/uno/${instructorId}`)
        setExisteInstructor(true)
      } catch (error: any) {
        console.log("Errro: ", error)
        setExisteInstructor(false)
      }
    }
    conseguirInstructor()
  }, [instructorId])

  if (!existeInstructor) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe ese instructor</p>
      </div>
    )
  } else {
    return (
      <div className="grow flex flex-col gap-4 w-full px-[20%]">
        <Filtros
          register={register}
          inputButtonOnClick={onClick}
          selectValues={["Por Nombre", "Por N. Identificación"]}
          crearRuta={`/asignar/aprendiz/${instructorId}`}
          crearButtonNombre="Asignar aprendiz"
        />
        <div className="flex flex-col gap-4 w-full py-4 border-t border-gray-200">
          {renderizarAprendices()}
        </div>
        <Paginacion paginacion={paginacion} setPaginacion={setPaginacion} data={aprendicesFiltrados} />
      </div>
    )
  }
}

