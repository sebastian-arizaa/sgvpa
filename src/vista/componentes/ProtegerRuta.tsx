import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";

interface Props {
  children?: React.ReactNode;
  retornaConSession: boolean;
  cargando?: boolean;
  retornaConUsers?: string
}

export function ProteccionSession({ children, retornaConSession, cargando, retornaConUsers }: Props) {
  const location = useLocation();
  console.log("🚀 ~ ProteccionSession ~ location:", location)
  const { userTipo } = useContext(SessionContext)

  if (!cargando) {
    if (retornaConSession) {
      if (userTipo) {
        if (!retornaConUsers) return <Navigate to="/ingresar" state={{ from: location }} replace />
        if (retornaConUsers.includes(userTipo)) {
          return <>{children}</>
        }
      }
      return <Navigate to="/ingresar" state={{ from: location }} replace />
    } else {
      if (userTipo) {
        switch (userTipo) {
          case "admin":
            return <Navigate to="/instructores" state={{ from: location }} replace />
          case "instructor":
            return <Navigate to="/mis-aprendices" state={{ from: location }} replace />
          case "aprendiz":
            return <Navigate to="/mis-actas" state={{ from: location }} replace />
        }
      }
      return <>{children}</>
    }
  } else {
    return <p>Loading...!</p>
  }
}
