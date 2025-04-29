import { Router } from "express";
import { adminsControlador } from "../../../controlador/bd/admins";

export const adminRouter = Router();

adminRouter.get("/ingresar", adminsControlador.ingresar)