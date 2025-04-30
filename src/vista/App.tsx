import { HashRouter, Route, Routes } from "react-router-dom"
import { Footer } from "./componentes/Footer"
import { Navbar } from "./componentes/Navbar"
import { Ingresar } from "./rutas/Ingresar"

function App() {

  return (
    <div className="relative">
      <HashRouter>
        <Navbar/>
        <Routes>
          <Route path="/ingresar" element={<Ingresar/>}/>
        </Routes>
        <Footer/>
      </HashRouter>
    </div>
  )
}

export default App
