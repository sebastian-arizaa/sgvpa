import { Router } from "express";
import { actasControlador } from "../../../controlador/bd/actas";

export const actasRouter = Router();

actasRouter.get("/todas-por-aprendiz/:id", actasControlador.conseguirTodasPorAprendiz)
actasRouter.post("/todas-por-aprendiz", actasControlador.agregarTodasPorAprendiz)
actasRouter.put("/una/:id", actasControlador.actualizarUna)