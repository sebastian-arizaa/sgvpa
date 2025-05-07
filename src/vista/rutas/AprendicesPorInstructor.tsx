import { useParams } from "react-router-dom"
import { AprendicesPorInstructor as AprendicesPorInstructorComponente } from "../componentes/AprendicesPorInstructor"


export function AprendicesPorInstructor() {
  const { id: instructorId } = useParams()

  if (!instructorId) {
    return (
      <div className="grow flex items-center">
        <p className="w-full text-center text-2xl text-stone-400">No existe ese instructor</p>
      </div>
    )
  } else {
    return (
      <AprendicesPorInstructorComponente instructorId={instructorId} />
    )
  }
}
