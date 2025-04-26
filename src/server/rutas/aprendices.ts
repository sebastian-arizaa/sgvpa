import { Router } from "express";
import { aprendicesControlador } from "../../controlador/aprendices";

export const aprendicesRouter = Router();

aprendicesRouter.get("/todos", aprendicesControlador.conseguirTodos);
aprendicesRouter.get("/uno/:id", aprendicesControlador.conseguirUno);
aprendicesRouter.post("/crear", aprendicesControlador.crear);
aprendicesRouter.put("/uno/:id", aprendicesControlador.actualizar);
aprendicesRouter.delete("/uno/:id", aprendicesControlador.eliminar);