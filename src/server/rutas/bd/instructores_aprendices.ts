import { Router } from "express";
import { instructoresAprendicesControlador } from "../../../controlador/bd/instructores_aprendices";

export const instructoresAprendicesRouter = Router();

instructoresAprendicesRouter.get("/todos", instructoresAprendicesControlador.conseguirTodos);
instructoresAprendicesRouter.get("/uno/:id", instructoresAprendicesControlador.conseguirUno);
instructoresAprendicesRouter.post("/uno", instructoresAprendicesControlador.crear);
instructoresAprendicesRouter.put("/uno/:id", instructoresAprendicesControlador.actualizar);
instructoresAprendicesRouter.delete("/uno/:id", instructoresAprendicesControlador.eliminar);