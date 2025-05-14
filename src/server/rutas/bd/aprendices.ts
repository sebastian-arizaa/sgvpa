import { Router } from "express";
import { AprendicesControlador } from "../../../controlador/bd/aprendices";
import { AprendicesInterface } from "../../../types/modeloInterfaces";

export const crearAprendicesRouter = ({AprendicesModelo}: {AprendicesModelo: AprendicesInterface}): Router => {
  const aprendicesControlador = new AprendicesControlador(AprendicesModelo)
  const aprendicesRouter = Router();
  aprendicesRouter.get("/todos", aprendicesControlador.conseguirTodos.bind(aprendicesControlador));
  aprendicesRouter.get("/uno/:id", aprendicesControlador.conseguirUno.bind(aprendicesControlador));
  aprendicesRouter.get("/todos-por-instructor/:id", aprendicesControlador.conseguirTodosPorInstructor.bind(aprendicesControlador));
  aprendicesRouter.get("/todos-por-formacion/:id", aprendicesControlador.conseguirTodosPorFormacion.bind(aprendicesControlador));
  aprendicesRouter.post("/uno", aprendicesControlador.crear.bind(aprendicesControlador));
  aprendicesRouter.put("/uno/:id", aprendicesControlador.actualizar.bind(aprendicesControlador));
  aprendicesRouter.delete("/uno/:id", aprendicesControlador.eliminar.bind(aprendicesControlador));
  aprendicesRouter.post("/ingresar", aprendicesControlador.ingresar.bind(aprendicesControlador));

  return aprendicesRouter
}