import express from "express";
import cors from "cors";
import path from "node:path"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { dotenvConfig } from "./dotenv";
import { adminRouter } from "./rutas/bd/admins";
import { aprendicesRouter } from "./rutas/bd/aprendices";
import { instructoresRouter } from "./rutas/bd/instructores";
import { formacionesRouter } from "./rutas/bd/formaciones";
import { __dirname } from "./globals";
import { mega } from "./conexion/megajs";
import { instructoresAprendicesRouter } from "./rutas/bd/instructores_aprendices";
import { aprendicesFormacionesRouter } from "./rutas/bd/aprendices_formaciones";
import { megajsRouter } from "./rutas/storage/megajs";
import { JwtPayloadType } from "../types";
import { sesionRouter } from "./rutas/sesion";
import { actasRouter } from "./rutas/bd/actas";

declare module 'express-serve-static-core' {
  interface Request {
    sesion?: JwtPayloadType | null;
  }
}

const app = express();
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)))
app.use(cookieParser());
app.use((req, _res, next) => {
  const token = req.cookies.token_acceso;
  req.sesion = { userTipo: null, userData: null }
  try {
    const data = (jwt.verify(token, dotenvConfig.SECRET_WORD) as JwtPayloadType);
    req.sesion = data
  } catch { }
  next()
})

app.use("/server/admins", adminRouter)
app.use("/server/instructores", instructoresRouter)
app.use("/server/aprendices", aprendicesRouter)
app.use("/server/formaciones", formacionesRouter)
app.use("/server/instructores-aprendices", instructoresAprendicesRouter)
app.use("/server/aprendices-formaciones", aprendicesFormacionesRouter)
app.use("/server/actas", actasRouter)
app.use("/server/megajs", megajsRouter)
app.use("/server/sesion", sesionRouter)

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
})

app.listen(dotenvConfig.PORT, async () => {
  await mega.ready.then(() => console.log("Conectado a MEGA"));
  console.log("Corriendo en http://localhost:" + dotenvConfig.PORT);
});