import express from "express";
import cors from "cors";
import path from "node:path"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { dotenvConfig } from "./dotenv";
import { crearAdminsRouter } from "./rutas/bd/admins";
import { crearAprendicesRouter } from "./rutas/bd/aprendices";
import { crearInstructoresRouter } from "./rutas/bd/instructores";
import { crearFormacionesRouter } from "./rutas/bd/formaciones";
import { __dirname } from "./globals";
import { mega } from "./conexion/megajs";
import { crearInstructoresAprendicesRouter} from "./rutas/bd/instructores_aprendices";
import { crearAprendicesFormacionesRouter } from "./rutas/bd/aprendices_formaciones";
import { megajsRouter } from "./rutas/storage/megajs";
import { JwtPayloadType } from "../types";
import { sesionRouter } from "./rutas/sesion";
import { crearActasRouter } from "./rutas/bd/actas";
import { modelos } from "./modelos";


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

const BD_TYPE = dotenvConfig.BD_TYPE

app.use("/server/admins", crearAdminsRouter({adminsModelo: modelos[BD_TYPE].admins}))
app.use("/server/instructores", crearInstructoresRouter({instructoresModelo: modelos[BD_TYPE].instructores}))
app.use("/server/aprendices", crearAprendicesRouter({AprendicesModelo: modelos[BD_TYPE].aprendices}))
app.use("/server/formaciones", crearFormacionesRouter({formacionesModelo: modelos[BD_TYPE].formaciones}))
app.use("/server/instructores-aprendices", crearInstructoresAprendicesRouter({instructoresAprendicesModelo: modelos[BD_TYPE].instructores_aprendices}))
app.use("/server/aprendices-formaciones", crearAprendicesFormacionesRouter({aprendicesFormacionesModelo: modelos[BD_TYPE].aprendices_formaciones}))
app.use("/server/actas", crearActasRouter({actaModelo: modelos[BD_TYPE].actas}))
app.use("/server/megajs", megajsRouter)
app.use("/server/sesion", sesionRouter)

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
})

app.listen(dotenvConfig.PORT, async () => {
  await mega.ready.then(() => console.log("Conectado a MEGA"));
  console.log("Corriendo en http://localhost:" + dotenvConfig.PORT);
});