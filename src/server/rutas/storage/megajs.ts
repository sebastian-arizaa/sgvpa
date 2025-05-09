import { Router } from "express";
import { megaJsControlador } from "../../../controlador/storage/megajs";
import multer from "multer";

const storage = multer.memoryStorage()
const subir = multer({ storage })

export const megajsRouter = Router()

megajsRouter.get("/archivo/uno/:nombreDirectorio/:nombreArchivo", megaJsControlador.conseguirUno)
megajsRouter.get("/archivo/todos-nombres/:nombreDirectorio", megaJsControlador.conseguirTodosNombres)
megajsRouter.post("/archivo/uno/", subir.single("file"), megaJsControlador.crear)
megajsRouter.delete("/archivo/uno/:nombreDirectorio/:nombreArchivo", megaJsControlador.eliminar)