import { Router } from "express";
import { aprendicesControlador } from "../../controlador/aprendices";

export const aprendicesRouter = Router();

aprendicesRouter.get("/todos", aprendicesControlador.conseguirTodos);
aprendicesRouter.get("/uno/:id", aprendicesControlador.conseguirUno);
aprendicesRouter.post("/uno", aprendicesControlador.crear);
aprendicesRouter.put("/uno/:id", aprendicesControlador.actualizar);
aprendicesRouter.delete("/uno/:id", aprendicesControlador.eliminar);
aprendicesRouter.get("/ingresar", aprendicesControlador.ingresar);