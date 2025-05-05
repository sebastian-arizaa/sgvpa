import { createContext } from "react";
import { JwtPayloadType } from "../../types";

interface SessionContextType extends JwtPayloadType {
  setSesionValue: React.Dispatch<React.SetStateAction<JwtPayloadType>>;
}

export const SessionContext = createContext<SessionContextType>({ userTipo: null, userData: null, setSesionValue: () => { } });
