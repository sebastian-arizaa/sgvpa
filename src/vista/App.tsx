import { HashRouter, Route, Routes } from "react-router-dom"
import { Footer } from "./componentes/Footer"
import { Navbar } from "./componentes/Navbar"
import { Ingresar } from "./rutas/Ingresar"
import { ProteccionSession } from "./componentes/ProtegerRuta"
import { appAxios } from "../utils/axios"
import { useEffect, useState } from "react"
import { JwtPayloadType } from "../types"
import { SessionContext } from "./context/SessionContext"
import { Aprendices } from "./rutas/Aprendices"
import { PerfilAprendiz } from "./rutas/PerfilAprendiz"
import { PerfilInstructor } from "./rutas/PerfilInstructor"
import { PerfilFormacion } from "./rutas/PerfilFormacion"
import { CrearAprendiz } from "./rutas/CrearAprendiz"
import { CrearInstructor } from "./rutas/CrearInstructor"
import { CrearFormacion } from "./rutas/CrearFormacion"
import { MiPerfil } from "./rutas/MiPerfil"
import { Instructores } from "./rutas/Instructores"

function App() {
  const [sesionValue, setSesionValue] = useState<JwtPayloadType>({ userData: null, userTipo: null })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const auth = async () => {
      try {
        const { data } = await appAxios.get<JwtPayloadType>("/server/sesion/ingresar")
        if (data.userTipo) {
          setSesionValue(data)
          setCargando(false)
        }
      } catch (error) {
        console.log(error)
        setCargando(false)
        // location.hash = "#/ingresar"
      }
    }
    auth()
  }, [])
  return (
    <SessionContext.Provider value={{ userTipo: sesionValue?.userTipo, userData: sesionValue?.userData, setSesionValue }}>
      <HashRouter>
        <div className="relative flex flex-col h-full min-h-dvh">
          <Navbar />
          <Routes>
            {/* <Route path="/ingresar" element={
              <ProteccionSession cargando={cargando} retornaConSession={false}>
                <Ingresar />
              </ProteccionSession>
            } />
            <Route path="/aprendices" element={
              <ProteccionSession cargando={cargando} retornaConSession={true}>
                <Aprendices />
              </ProteccionSession>
            } /> */}
            <Route path="/ingresar" element={<Ingresar />} />
            <Route path="/aprendices" element={<Aprendices />} />
            <Route path="/instructores" element={<Instructores />} />

            <Route path="/perfil/aprendiz/:id" element={<PerfilAprendiz />} />
            <Route path="/perfil/instructor/:id" element={<PerfilInstructor />} />
            <Route path="/perfil/formacion/:id" element={<PerfilFormacion />} />
            <Route path="/crear/aprendiz" element={<CrearAprendiz />} />
            <Route path="/crear/instructor" element={<CrearInstructor />} />
            <Route path="/crear/formacion" element={<CrearFormacion />} />
            <Route path="/miperfil" element={<MiPerfil />} />
          </Routes>
          <Footer />
        </div>
      </HashRouter>
    </SessionContext.Provider>
  )
}

export default App
