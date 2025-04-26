import { Router } from "express";
import { adminsControlador } from "../../controlador/admins";

export const adminRouter = Router();

adminRouter.get("/ingresar", adminsControlador.ingresar)