import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SessionContext } from "../context/SessionContext";

interface Props {
  children?: React.ReactNode;
  retornaConSession: boolean;
  cargando?: boolean;
}

export function ProteccionSession({ children, retornaConSession, cargando }: Props) {
  const location = useLocation();
  console.log("🚀 ~ ProteccionSession ~ location:", location)
  const { userTipo } = useContext(SessionContext)

  if (!cargando) {
    if (retornaConSession) {
      if (userTipo) {
        return <>{children}</>
      }
      return <Navigate to="/ingresar" state={{ from: location }} replace />
    } else {
      if (userTipo) {
        switch (userTipo) {
          case "admin":
            return <Navigate to="/aprendices" state={{ from: location }} replace />
          case "instructor":
            return <Navigate to="/aprendices" state={{ from: location }} replace />
          case "aprendiz":
            return <Navigate to="/actas" state={{ from: location }} replace />
        }
      }
      return <>{children}</>
    }
  } else {
    return <p>Loading...!</p>
  }
}
