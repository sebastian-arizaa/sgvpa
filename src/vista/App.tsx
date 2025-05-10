import { HashRouter, Route, Routes } from "react-router-dom"
import { Footer } from "./componentes/Footer"
import { Navbar } from "./componentes/Navbar"
import { Ingresar } from "./rutas/Ingresar"
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
import { Formaciones } from "./rutas/Formaciones"
import { MisAprendices } from "./rutas/MisAprendices"
import { AsignarAprendiz } from "./rutas/AsignarAprendiz"
import { AprendicesPorInstructor } from "./rutas/AprendicesPorInstructor"
import { AprendizActas } from "./rutas/AprendizActas"
import { MisActas } from "./rutas/MisActas"
import { ProteccionSession } from "./componentes/ProtegerRuta"

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
        location.hash = "#/ingresar"
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
            <Route path="/aprendices/formacion/:id" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <Aprendices />
              </ProteccionSession>
            } />
            <Route path="/instructores" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <Instructores />
              </ProteccionSession>
            } />
            <Route path="/formaciones" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <Formaciones />
              </ProteccionSession>
            } />
            <Route path="/mis-aprendices" element={
              <ProteccionSession retornaConUsers="instructor" cargando={cargando} retornaConSession={true}>
                <MisAprendices />
              </ProteccionSession>
            } />
            <Route path="/asignar/aprendiz/:id" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <AsignarAprendiz />
              </ProteccionSession>
            } />
            <Route path="/aprendices/instructor/:id" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <AprendicesPorInstructor />
              </ProteccionSession>
            } />
            <Route path="/aprendiz/actas/:id" element={
              <ProteccionSession retornaConUsers="admin, instructor" cargando={cargando} retornaConSession={true}>
                <AprendizActas />
              </ProteccionSession>
            } />
            <Route path="/mis-actas" element={
              <ProteccionSession retornaConUsers="aprendiz" cargando={cargando} retornaConSession={true}>
                <MisActas />
              </ProteccionSession>
            } />
            <Route path="/miperfil" element={
              <ProteccionSession retornaConUsers="instructor, aprendiz" cargando={cargando} retornaConSession={true}>
                <MiPerfil />
              </ProteccionSession>
            } />
            <Route path="/perfil/aprendiz/:id" element={
              <ProteccionSession retornaConUsers="admin, instructor" cargando={cargando} retornaConSession={true}>
                <PerfilAprendiz />
              </ProteccionSession>
            } />
            <Route path="/perfil/instructor/:id" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <PerfilInstructor />
              </ProteccionSession>
            } />
            <Route path="/perfil/formacion/:id" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <PerfilFormacion />
              </ProteccionSession>
            } />
            <Route path="/crear/aprendiz/:id" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <CrearAprendiz />
              </ProteccionSession>
            } />
            <Route path="/crear/formacion" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <CrearFormacion />
              </ProteccionSession>
            } />
            <Route path="/crear/instructor" element={
              <ProteccionSession retornaConUsers="admin" cargando={cargando} retornaConSession={true}>
                <CrearInstructor />
              </ProteccionSession>
            } />
            <Route path="*" element={<ProteccionSession cargando={cargando} retornaConSession={true}><p>a</p></ProteccionSession>} />

            {/* <Route path="*" element={<div className="grow flex items-center"><Title className="w-full" tamaño="grande">No existe esta sección</Title></div>} /> */}

            {/* <Route path="/ingresar" element={<Ingresar />} />
            <Route path="/aprendices/formacion/:id" element={<Aprendices />} />
            <Route path="/instructores" element={<Instructores />} />
            <Route path="/formaciones" element={<Formaciones />} />
            <Route path="/mis-aprendices" element={<MisAprendices />} />
            <Route path="/asignar/aprendiz/:id" element={<AsignarAprendiz />} />
            <Route path="/aprendices/instructor/:id" element={<AprendicesPorInstructor />} />
            <Route path="/aprendiz/actas/:id" element={<AprendizActas />} />
            <Route path="/mis-actas" element={<MisActas />} />
            <Route path="/perfil/aprendiz/:id" element={<PerfilAprendiz />} />

            <Route path="/perfil/instructor/:id" element={<PerfilInstructor />} />
            <Route path="/perfil/formacion/:id" element={<PerfilFormacion />} />
            <Route path="/crear/aprendiz/:id" element={<CrearAprendiz />} />
            <Route path="/crear/instructor" element={<CrearAprendiz />} />
            <Route path="/crear/formacion" element={<CrearFormacion />} />
            <Route path="/miperfil" element={<MiPerfil />} /> */}
          </Routes>
          <Footer />
        </div>
      </HashRouter>
    </SessionContext.Provider>
  )
}

export default App
