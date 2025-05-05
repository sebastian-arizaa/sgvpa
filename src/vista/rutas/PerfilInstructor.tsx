import { useEffect, useState } from "react"
import { InstructorType } from "../../types"
import { useParams } from "react-router-dom"
import { appAxios } from "../../utils/axios"
import { PerfilInstructor as PerfilInstructorComponente } from "../componentes/PerfilInstructor"

export function PerfilInstructor() {
  const { id } = useParams()
  const [instructor, setInstructor] = useState<InstructorType>({
    nombre: "",
    apellidos: "",
    email: "",
    hash_contraseña: "",
    id: "",
    salt: "",
    telefono: ""
  })

  useEffect(() => {
    const conseguirInstructor = async () => {
      try {
        const { data: instructor } = await appAxios.get<InstructorType>(`/server/instructores/uno/${id}`);
        setInstructor(instructor)
      } catch (error: any) {
        console.log(error)
      }
    }
    conseguirInstructor()
  }, [id])

  return (
    <PerfilInstructorComponente instructorData={instructor} />
  )
}
