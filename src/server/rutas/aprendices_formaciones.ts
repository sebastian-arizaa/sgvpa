import { Router } from "express";
import { aprendicesFormacionesControlador } from "../../controlador/aprendices_formaciones";

export const aprendicesFormacionesRouter = Router();

aprendicesFormacionesRouter.get("/todos", aprendicesFormacionesControlador.conseguirTodos);
aprendicesFormacionesRouter.get("/uno/:id", aprendicesFormacionesControlador.conseguirUno);
aprendicesFormacionesRouter.post("/uno", aprendicesFormacionesControlador.crear);
aprendicesFormacionesRouter.put("/uno/:id", aprendicesFormacionesControlador.actualizar);
aprendicesFormacionesRouter.delete("/uno/:id", aprendicesFormacionesControlador.eliminar);