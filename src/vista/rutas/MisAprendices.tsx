import { useContext } from "react"
import { AprendicesPorInstructor } from "../componentes/AprendicesPorInstructor"
import { SessionContext } from "../context/SessionContext"

export function MisAprendices() {
  const { userData } = useContext(SessionContext)
  console.log("🚀 ~ MisAprendices ~ userData:", userData)
  if (!userData?.id) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe ese instructor</p>
      </div>
    )
  } else {
    return (
      <AprendicesPorInstructor instructorId={userData?.id} />
    )
  }
}

