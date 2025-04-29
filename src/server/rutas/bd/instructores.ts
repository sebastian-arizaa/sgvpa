import { Router } from "express";
import { instructoresControlador } from "../../../controlador/bd/instructores";

export const instructoresRouter = Router();

instructoresRouter.get("/todos", instructoresControlador.conseguirTodos);
instructoresRouter.get("/uno/:id", instructoresControlador.conseguirUno);
instructoresRouter.post("/uno", instructoresControlador.crear);
instructoresRouter.put("/uno/:id", instructoresControlador.actualizar);
instructoresRouter.delete("/uno/:id", instructoresControlador.eliminar);
instructoresRouter.get("/ingresar", instructoresControlador.ingresar);
