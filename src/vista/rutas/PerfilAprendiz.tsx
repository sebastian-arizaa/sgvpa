import { useEffect, useState } from "react"
import { AprendizType } from "../../types"
import { useParams } from "react-router-dom"
import { appAxios } from "../../utils/axios"
import { PerfilAprendiz as PerfilAprendizComponente } from "../componentes/PerfilAprendiz"

export function PerfilAprendiz() {
  const { id } = useParams()
  const [aprendiz, setAprendiz] = useState<AprendizType>({
    nombre: "",
    apellidos: "",
    email: "",
    formacion_actual_id: "",
    hash_contraseña: "",
    id: "",
    salt: "",
    telefono: ""
  })

  useEffect(() => {
    const conseguirAprendiz = async () => {
      try {
        const { data: aprendiz } = await appAxios.get<AprendizType>(`/server/aprendices/uno/${id}`);
        setAprendiz(aprendiz)
      } catch (error: any) {
        console.log(error)
      }
    }
    conseguirAprendiz()
  }, [id])

  return (
    <PerfilAprendizComponente aprendizData={aprendiz} />
  )
}
