import { Router } from "express";
import { InstructoresControlador } from "../../../controlador/bd/instructores";
import { InstructoresInterface } from "../../../types/modeloInterfaces";

export const crearInstructoresRouter = ({instructoresModelo}: {instructoresModelo: InstructoresInterface}): Router => {
  const instructoresControlador = new InstructoresControlador(instructoresModelo) 
  const instructoresRouter = Router();
  instructoresRouter.get("/todos", instructoresControlador.conseguirTodos.bind(instructoresControlador));
  instructoresRouter.get("/uno/:id", instructoresControlador.conseguirUno.bind(instructoresControlador));
  instructoresRouter.post("/uno", instructoresControlador.crear.bind(instructoresControlador));
  instructoresRouter.put("/uno/:id", instructoresControlador.actualizar.bind(instructoresControlador));
  instructoresRouter.delete("/uno/:id", instructoresControlador.eliminar.bind(instructoresControlador));
  instructoresRouter.post("/ingresar", instructoresControlador.ingresar.bind(instructoresControlador));

  return instructoresRouter
}
