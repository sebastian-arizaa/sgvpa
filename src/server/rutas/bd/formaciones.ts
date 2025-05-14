import { Router } from "express";
import { FormacionesInterface } from "../../../types/modeloInterfaces";
import { FormacionesControlador } from "../../../controlador/bd/formaciones";

export const crearFormacionesRouter = ({formacionesModelo}: {formacionesModelo: FormacionesInterface}): Router => {
  const formacionesControlador = new FormacionesControlador(formacionesModelo)
  const formacionesRouter = Router();
  formacionesRouter.get("/todos", formacionesControlador.conseguirTodos.bind(formacionesControlador));
  formacionesRouter.get("/uno/:id", formacionesControlador.conseguirUno.bind(formacionesControlador));
  formacionesRouter.post("/uno", formacionesControlador.crear.bind(formacionesControlador));
  formacionesRouter.put("/uno/:id", formacionesControlador.actualizar.bind(formacionesControlador));
  formacionesRouter.delete("/uno/:id", formacionesControlador.eliminar.bind(formacionesControlador));

  return formacionesRouter
}