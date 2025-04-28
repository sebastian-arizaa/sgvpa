import { Router } from "express";
import { formacionesControlador } from "../../controlador/formaciones";

export const formacionesRouter = Router();

formacionesRouter.get("/todos", formacionesControlador.conseguirTodos);
formacionesRouter.get("/uno/:id", formacionesControlador.conseguirUno);
formacionesRouter.post("/uno", formacionesControlador.crear);
formacionesRouter.put("/uno/:id", formacionesControlador.actualizar);
formacionesRouter.delete("/uno/:id", formacionesControlador.eliminar);