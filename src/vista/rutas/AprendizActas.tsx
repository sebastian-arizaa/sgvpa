import { useParams } from "react-router-dom"
import { Actas } from "../componentes/Actas"

export function AprendizActas() {
  const { id: aprendizId } = useParams()
  if (!aprendizId) {

  } else {
    return (
      <Actas aprendizId={aprendizId} />
    )
  }
}
