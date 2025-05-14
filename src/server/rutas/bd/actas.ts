import { Router } from "express";
import { ActasControlador } from "../../../controlador/bd/actas";
import { ActasInterface } from "../../../types/modeloInterfaces";

export const crearActasRouter = ({actaModelo}: {actaModelo: ActasInterface}): Router => {
  const actasControlador = new ActasControlador(actaModelo)
  const actasRouter = Router();
  actasRouter.get("/todas-por-aprendiz/:id", actasControlador.conseguirTodasPorAprendiz.bind(actasControlador))
  actasRouter.post("/todas-por-aprendiz", actasControlador.agregarTodasPorAprendiz.bind(actasControlador))
  actasRouter.put("/una/:id", actasControlador.actualizarUna.bind(actasControlador))

  return actasRouter
}
