import { Router } from "express";
import { adminsControlador } from "../../../controlador/bd/admins";

export const adminRouter = Router();

adminRouter.get("/uno/:id", adminsControlador.conseguirUno)
adminRouter.post("/ingresar", adminsControlador.ingresar)