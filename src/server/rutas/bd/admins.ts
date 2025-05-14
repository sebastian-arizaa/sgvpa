import { Router } from "express";
import { AdminsControlador } from "../../../controlador/bd/admins";
import { AdminsInterface } from "../../../types/modeloInterfaces";

export const crearAdminsRouter = ({adminsModelo}: {adminsModelo: AdminsInterface}): Router => {
  const adminsControlador = new AdminsControlador(adminsModelo)
  const adminsRouter = Router();
  adminsRouter.get("/uno/:id", adminsControlador.conseguirUno.bind(adminsControlador))
  adminsRouter.post("/ingresar", adminsControlador.ingresar.bind(adminsControlador))

  return adminsRouter
}