import { Router } from "express";
import { AprendicesFormacionesInterface } from "../../../types/modeloInterfaces";
import { AprendicesFormacionesControlador } from "../../../controlador/bd/aprendices_formaciones";

export const crearAprendicesFormacionesRouter = ({aprendicesFormacionesModelo}: {aprendicesFormacionesModelo: AprendicesFormacionesInterface}): Router => {
  const aprendicesFormacionesControlador = new AprendicesFormacionesControlador(aprendicesFormacionesModelo)
  const aprendicesFormacionesRouter = Router();
  aprendicesFormacionesRouter.get("/todos", aprendicesFormacionesControlador.conseguirTodos.bind(aprendicesFormacionesControlador));
  aprendicesFormacionesRouter.get("/uno/:id", aprendicesFormacionesControlador.conseguirUno.bind(aprendicesFormacionesControlador));
  aprendicesFormacionesRouter.post("/uno", aprendicesFormacionesControlador.crear.bind(aprendicesFormacionesControlador));
  aprendicesFormacionesRouter.put("/uno/:id", aprendicesFormacionesControlador.actualizar.bind(aprendicesFormacionesControlador));
  aprendicesFormacionesRouter.delete("/uno/:id", aprendicesFormacionesControlador.eliminar.bind(aprendicesFormacionesControlador));
  
  return aprendicesFormacionesRouter
}