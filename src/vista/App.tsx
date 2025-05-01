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

function App() {
  const [sesionValue, setSesionValue] = useState<JwtPayloadType | null>({ userData: null, userTipo: null })
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
            <Route path="/ingresar" element={
              <ProteccionSession cargando={cargando} retornaConSession={false}>
                <Ingresar />
              </ProteccionSession>
            } />
            <Route path="/aprendices" element={
              <ProteccionSession cargando={cargando} retornaConSession={true}>
                <Aprendices />
              </ProteccionSession>
            } />
          </Routes>
          <Footer />
        </div>
      </HashRouter>
    </SessionContext.Provider>
  )
}

export default App
