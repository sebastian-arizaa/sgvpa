import { Router } from "express";
import { instructoresControlador } from "../../controlador/instructores";

export const instructoresRouter = Router();

instructoresRouter.get("/todos", instructoresControlador.conseguirTodos);
instructoresRouter.get("/uno/:id", instructoresControlador.conseguirUno);
instructoresRouter.post("/crear", instructoresControlador.crear);
instructoresRouter.put("/uno/:id", instructoresControlador.actualizar);
instructoresRouter.delete("/uno/:id", instructoresControlador.eliminar);