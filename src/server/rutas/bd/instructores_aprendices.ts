import { Router } from "express";
import { InstructoresAprendicesControlador } from "../../../controlador/bd/instructores_aprendices";
import { InstructoresAprendicesInterface } from "../../../types/modeloInterfaces";

export const crearInstructoresAprendicesRouter = ({instructoresAprendicesModelo}: {instructoresAprendicesModelo: InstructoresAprendicesInterface}): Router => {
  const instructoresAprendicesControlador = new InstructoresAprendicesControlador(instructoresAprendicesModelo)
  const instructoresAprendicesRouter = Router();
  instructoresAprendicesRouter.get("/todos", instructoresAprendicesControlador.conseguirTodos.bind(instructoresAprendicesControlador));
  instructoresAprendicesRouter.get("/uno/:id", instructoresAprendicesControlador.conseguirUno.bind(instructoresAprendicesControlador));
  instructoresAprendicesRouter.post("/uno", instructoresAprendicesControlador.crear.bind(instructoresAprendicesControlador));
  instructoresAprendicesRouter.put("/uno/:id", instructoresAprendicesControlador.actualizar.bind(instructoresAprendicesControlador));
  instructoresAprendicesRouter.delete("/uno/:id", instructoresAprendicesControlador.eliminar.bind(instructoresAprendicesControlador));

  return instructoresAprendicesRouter
}