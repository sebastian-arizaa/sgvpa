import { NavLink } from "react-router-dom";

export function Navbar() {
  console.log("Renderiza")
  const estilosBaseNavLink = "flex items-center h-12 px-2 border-b-2 border-transparent hover:border-green-500"
  return (
    <header className="w-full px-8 shadow-sm">
      <nav className="flex gap-4">
        <ul className="flex justify-between gap-4 w-full ">
          <div className="flex items-center gap-4">
            <li className="flex items-center text-2xl font-semibold text-green-500">
              <NavLink 
                className="cursor-pointer" 
                to="/login?user=admin"
              >SGVPA</NavLink>
            </li>
            <li >
              <NavLink 
               className={({ isActive }) => isActive ?  `${estilosBaseNavLink} border-green-500!` : estilosBaseNavLink}
                to="/ingresar?usuario=admin"
              >Aprendices</NavLink>
            </li>
            <li >
              <NavLink 
                // className="flex items-center h-12 px-2 border-b-2 border-transparent hover:border-green-500"  
               className={({ isActive }) => isActive ?  `${estilosBaseNavLink} border-green-500!` : estilosBaseNavLink}
                to="/instructores"
              >Instructores</NavLink>
            </li>
          </div>
          <div className="flex gap-4">
            <li>
              <NavLink 
                className="flex items-center justify-center h-12 w-12 border-green-200 bg-green-500 text-white font-semibold cursor-pointer" 
                to="/perfil"
              >M</NavLink>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  )
}
