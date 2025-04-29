import { Router } from "express";
import { aprendicesControlador } from "../../../controlador/bd/aprendices";

export const aprendicesRouter = Router();

aprendicesRouter.get("/todos", aprendicesControlador.conseguirTodos);
aprendicesRouter.get("/uno/:id", aprendicesControlador.conseguirUno);
aprendicesRouter.get("/todos-por-instructor/:id", aprendicesControlador.conseguirTodosPorInstructor);
aprendicesRouter.get("/todos-por-formacion/:id", aprendicesControlador.conseguirTodosPorFormacion);
aprendicesRouter.post("/uno", aprendicesControlador.crear);
aprendicesRouter.put("/uno/:id", aprendicesControlador.actualizar);
aprendicesRouter.delete("/uno/:id", aprendicesControlador.eliminar);
aprendicesRouter.get("/ingresar", aprendicesControlador.ingresar);