import { Router } from "express";
import { sesionControlador } from "../../../controlador/sesion";

export const sesionRouter = Router();

sesionRouter.get("/ingresar", sesionControlador.ingresar);
sesionRouter.get("/salir", sesionControlador.salir);