import { Router } from "express";
import { instructoresControlador } from "../../controlador/instructores";

export const instructoresRouter = Router();

instructoresRouter.get("/todos", instructoresControlador.conseguirTodosInstructores)