import { Router } from "express";
import { formacionesControlador } from "../../controlador/formaciones";

export const formacionesRouter = Router();

formacionesRouter.get("/todos", formacionesControlador.conseguirTodasFormaciones)