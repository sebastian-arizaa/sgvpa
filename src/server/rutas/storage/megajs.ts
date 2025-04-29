import { Router } from "express";
import { megaJsControlador } from "../../../controlador/storage/megajs";
import multer from "multer";

const storage = multer.memoryStorage()
const subir = multer({storage})

export const megajsRouter = Router()

megajsRouter.get("/archivo/uno", megaJsControlador.conseguirUno)
megajsRouter.get("/archivo/todos-nombres/:nombreDirectorio", megaJsControlador.conseguirTodosNombres)
megajsRouter.post("/archivo/uno/:nombreDirectorio", subir.single("file"), megaJsControlador.crear)
megajsRouter.delete("/archivo/uno", megaJsControlador.eliminar)