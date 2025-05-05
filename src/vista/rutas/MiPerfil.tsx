import { useContext, useEffect, useState } from "react"
import { SessionContext } from "../context/SessionContext"
import { PerfilAprendiz } from "../componentes/PerfilAprendiz"
import { AprendizType, InstructorType } from "../../types"
import { appAxios } from "../../utils/axios"
import { PerfilInstructor } from "../componentes/PerfilInstructor"

export function MiPerfil() {
  const { userTipo, userData } = useContext(SessionContext)
  console.log("🚀 ~ MiPerfil ~ userTipo:", userTipo)
  console.log("🚀 ~ MiPerfil ~ userData:", userData)
  const [userPerfilData, setUserPerfilData] = useState<AprendizType | InstructorType | null>(null)

  useEffect(() => {
    if (userTipo === "aprendiz") {
      const conseguirAprendiz = async () => {
        try {
          const { data: aprendiz } = await appAxios.get<AprendizType>(`/server/aprendices/uno/${userData?.id}`);
          setUserPerfilData(aprendiz)
        } catch (error: any) {
          console.log(error)
        }
      }
      conseguirAprendiz()
    } else if (userTipo === "instructor") {
      const conseguirInstructor = async () => {
        try {
          const { data: instructor } = await appAxios.get<InstructorType>(`/server/instructores/uno/${userData?.id}`);
          setUserPerfilData(instructor)
        } catch (error: any) {
          console.log(error)
        }
      }
      conseguirInstructor()
    }
  }, [userTipo])

  if (userTipo === "aprendiz") {
    if (!userPerfilData) return
    if ("formacion_actual_id" in userPerfilData)
      return (
        <PerfilAprendiz aprendizData={userPerfilData} />
      )
  } else if (userTipo === "instructor") {
    console.log("🚀 ~ MiPerfil ~ userPerfilData:", userPerfilData)
    console.log("I hope this is working")
    if (!userPerfilData) return
    return (
      <PerfilInstructor instructorData={userPerfilData} />
    )
  }
}
