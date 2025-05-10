import { useEffect, useState } from "react";
import { InstructorType } from "../../types";
import { appAxios } from "../../utils/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Paginacion from "../componentes/Paginacion";
import { Filtros } from "../componentes/Filtros";
import { Button } from "../componentes/base/Button";

export function Instructores() {
  const navigation = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [instructores, setInstructores] = useState<InstructorType[]>([])
  const [instructoresfiltrados, setInstructoresfiltrados] = useState<InstructorType[]>([])
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
      setInstructoresfiltrados(instructores.filter(instructores => (instructores.nombre.toLowerCase() + " " + instructores.apellidos.toLowerCase()).includes(data.datoFiltro.toLowerCase().trim())))
      newSearchParams.set("tipoFiltro", "Por Nombre")
      newSearchParams.set("datoFiltro", data.datoFiltro)
      setSearchParams(newSearchParams)
    } else {
      setInstructoresfiltrados(instructores.filter(instructores => instructores.id.toLowerCase().includes(data.datoFiltro.trim())))
      newSearchParams.set("tipoFiltro", "Por N. Identificación")
      newSearchParams.set("datoFiltro", data.datoFiltro)
      setSearchParams(newSearchParams)
    }
    setPaginacion({ inicio: 1, fin: 10 })
  })

  const renderizarInstructores = () => {
    if (!instructoresfiltrados.length) return
    let paginacionInstructores: InstructorType[] = []
    for (let i = (paginacion.inicio - 1); i < (paginacion.fin); i++) {
      if (instructoresfiltrados[i]) {
        paginacionInstructores.push(instructoresfiltrados[i])
      } else {
        break;
      }
    }
    return paginacionInstructores.map(instructor => (
      <div
        key={instructor.id}
        onClick={() => navigation(`/perfil/instructor/${instructor.id}`)}
        className="flex gap-2 justify-between items-center shadow-md border-t-4 border-gray-200 p-2 cursor-pointer hover:bg-gray-200"
      >
        <p className="max-sm:w-[70%]">{instructor.nombre} {instructor.apellidos}</p>
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              navigation(`/aprendices/instructor/${instructor.id}`)
            }}
            variante="primario"
          >Ver Aprendices</Button>
        </div>
      </div>
    ))
  }

  useEffect(() => {
    const conseguirTodosInstructores = async () => {
      try {
        const { data: instructores } = await appAxios.get<InstructorType[]>("/server/instructores/todos")
        const instructoresOrdenados = instructores.sort(({ nombre: NombreA }, { nombre: nombreB }) => {
          if (NombreA.toLowerCase() < nombreB.toLowerCase()) return -1;
          if (NombreA.toLowerCase() > nombreB.toLowerCase()) return 1;
          return 0
        })
        setInstructoresfiltrados(instructoresOrdenados)
        setInstructores(instructoresOrdenados)
      } catch (error: any) {
        console.log("Error: ", error)
      }
    }
    conseguirTodosInstructores()
  }, [])

  useEffect(() => {
    if (instructoresfiltrados.length) {
      const tipoFiltro = searchParams.get("tipoFiltro")
      const datoFiltro = searchParams.get("datoFiltro")
      if (!tipoFiltro) return
      if (!datoFiltro) return
      if (renderizoPorParamentros) return
      if (tipoFiltro === "Por Nombre") {
        setInstructoresfiltrados(instructores.filter(instructores => (instructores.nombre.toLowerCase() + " " + instructores.apellidos.toLowerCase()).includes(datoFiltro.toLowerCase().trim())))
      } else {
        setInstructoresfiltrados(instructores.filter(instructores => instructores.id.toLowerCase().includes(datoFiltro)))
      }
      setRenderizoPorParamentros(true)
      setPaginacion({ inicio: 1, fin: 10 })
    }
  }, [instructoresfiltrados])

  return (
    <div className="grow flex flex-col gap-4 w-full px-[20%]  max-lg:px-4">
      <Filtros
        register={register}
        inputButtonOnClick={onClick}
        selectValues={["Por Nombre", "Por N. Identificación"]}
        crearRuta="/crear/instructor"
        crearButtonNombre="Crear Instructores"
      />
      <div className="flex flex-col gap-4 w-full py-4 border-t border-gray-200">
        {renderizarInstructores()}
      </div>
      <Paginacion paginacion={paginacion} setPaginacion={setPaginacion} data={instructoresfiltrados} />
    </div>
  )
}
