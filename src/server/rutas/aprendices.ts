import { Router } from "express";
import { aprendicesControlador } from "../../controlador/aprendices";
import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer({storage})

export const aprendicesRouter = Router();

aprendicesRouter.post("/todos", upload.single("file"), aprendicesControlador.conseguirTodosAprendices)