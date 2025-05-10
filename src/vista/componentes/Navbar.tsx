import { NavLink } from "react-router-dom";
import { appAxios } from "../../utils/axios";
import { useContext, useState } from "react";
import { SessionContext } from "../context/SessionContext";
import { IoMdMenu } from "react-icons/io";

export function Navbar() {
  const { setSesionValue, userTipo, userData } = useContext(SessionContext)
  const [menuAbierto, setMenuAbierto] = useState(false)
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
        { to: "/instructores", text: "Instructores", onClick: () => { setMenuAbierto(false) } },
        { to: "/formaciones", text: "Formaciones", onClick: () => { setMenuAbierto(false) } },
        { to: "/ingresar", text: "Cerrar Sesion", onClick: () => { appAxios.get("/server/sesion/salir"); setSesionValue({ userTipo: null, userData: null }); setMenuAbierto(false) } }
      ]
      break;
    case "instructor":
      links = [
        { to: "/mis-aprendices", text: "Mis aprendices", onClick: () => { setMenuAbierto(false) } },
        { to: "/ingresar", text: "Cerrar Sesion", onClick: () => { appAxios.get("/server/sesion/salir"); setSesionValue({ userTipo: null, userData: null }); setMenuAbierto(false) } }
      ]
      break;
    case "aprendiz":
      links = [
        { to: "/mis-actas", text: "Mis Actas", onClick: () => { setMenuAbierto(false) } },
        { to: "/ingresar", text: "Cerrar Sesion", onClick: () => { appAxios.get("/server/sesion/salir"); setSesionValue({ userTipo: null, userData: null }); setMenuAbierto(false) } }
      ]
      break;
  }

  return (
    <header className="w-full px-8 shadow-sm min-h-12 max-sm:px-4">
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
                  className={({ isActive }) => isActive ? `${estilosBaseNavLink} border-green-500! max-sm:hidden` : estilosBaseNavLink + " max-sm:hidden"}
                  to={link.to}
                >{link.text}</NavLink>
              </li>
            ))}
          </div>
          {userTipo != "admin" && userTipo != null && (
            <div className="flex gap-4 max-sm:hidden">
              <li>
                <NavLink
                  className="flex items-center justify-center h-12 w-12 border-green-200 bg-green-500 text-white font-semibold cursor-pointer"
                  to="/miperfil"
                >{letraPerfil}</NavLink>
              </li>
            </div>
          )}
        </ul>
        {userTipo && <div onClick={() => setMenuAbierto(!menuAbierto)} className="hidden items-center cursor-pointer max-sm:flex"><IoMdMenu className="h-10 w-10 text-green-500" /></div>}
        {menuAbierto && (
          <div className="absolute z-10 top-14 left-0 w-full bg-black/80 h-screen min-sm:hidden">
            <ul className="flex flex-col gap-4 p-4 w-full h-1/2 mt-2 bg-white">
              {userTipo !== "admin" && (<li key={"MiPerfli"}>
                <NavLink
                  // onClick={link.onClick}
                  className={({ isActive }) => isActive ? `${estilosBaseNavLink} border-green-500!` : estilosBaseNavLink + " border-b-gray-200"}
                  to="/miperfil"
                >Mi Perfil</NavLink>
              </li>)}
              {links.map(link => (
                <li key={link.text}>
                  <NavLink
                    onClick={link.onClick}
                    className={({ isActive }) => isActive ? `${estilosBaseNavLink} border-green-500!` : estilosBaseNavLink + " border-b-gray-200"}
                    to={link.to}
                  >{link.text}</NavLink>
                </li>
              ))}

            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
