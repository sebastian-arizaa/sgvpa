import { useContext } from "react"
import { Actas } from "../componentes/Actas"
import { SessionContext } from "../context/SessionContext"

export function MisActas() {
  const { userData } = useContext(SessionContext)

  if (!userData?.id) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe ese aprendiz</p>
      </div>
    )
  } else {
    return (
      <Actas aprendizId={userData.id} />
    )
  }
}
