import { NavLink } from "react-router-dom";
import { appAxios } from "../../utils/axios";
import { useContext } from "react";
import { SessionContext } from "../context/SessionContext";

export function Navbar() {
  const { setSesionValue, userTipo, userData } = useContext(SessionContext)
  const estilosBaseNavLink = "flex items-center h-12 px-2 border-b-2 border-transparent hover:border-green-500"

  let letraPerfil = ""
  if (userData) {
    if ("nombre" in userData) {
      letraPerfil = userData.nombre.toUpperCase()[0]
    }
  }

  let links: Array<{ to: string, text: string, onClick?: () => void }> = []
  switch (userTipo) {
    case "admin":
      links = [
        { to: "/aprendices/1027", text: "Aprendices" },
        { to: "/instructores", text: "Instructores" },
        { to: "/formaciones", text: "Formaciones" },
        { to: "/ingresar", text: "Cerrar Sesion", onClick: () => { appAxios.get("/server/sesion/salir"); setSesionValue({ userTipo: null, userData: null }) } }
      ]
      break;
    case "instructor":
      links = [
        { to: "/aprendices", text: "Mis aprendices" },
        { to: "/ingresar", text: "Cerrar Sesion", onClick: () => { appAxios.get("/server/sesion/salir"); setSesionValue({ userTipo: null, userData: null }) } }
      ]
      break;
    case "aprendiz":
      links = [
        { to: "/actas", text: "Mis Actas" },
        { to: "/ingresar", text: "Cerrar Sesion", onClick: () => { appAxios.get("/server/sesion/salir"); setSesionValue({ userTipo: null, userData: null }) } }
      ]
      break;
  }

  return (
    <header className="w-full px-8 shadow-sm min-h-12">
      <nav className="flex gap-4 min-h-12">
        <ul className="flex justify-between gap-4 w-full min-h-12">
          <div className="flex items-center gap-4">
            <li className="flex items-center text-2xl font-semibold text-green-500">
              <NavLink
                className="cursor-pointer"
                to="/ingresar"
              >SGVPA</NavLink>
            </li>
            {links.map(link => (
              <li key={link.text}>
                <NavLink
                  onClick={link.onClick}
                  className={({ isActive }) => isActive ? `${estilosBaseNavLink} border-green-500!` : estilosBaseNavLink}
                  to={link.to}
                >{link.text}</NavLink>
              </li>
            ))}
          </div>
          {userTipo != "admin" && userTipo != null && (
            <div className="flex gap-4">
              <li>
                <NavLink
                  className="flex items-center justify-center h-12 w-12 border-green-200 bg-green-500 text-white font-semibold cursor-pointer"
                  to="/miperfil"
                >{letraPerfil}</NavLink>
              </li>
            </div>
          )}
        </ul>
      </nav>
    </header>
  )
}
