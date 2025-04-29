import express from "express";
import cors from "cors";
import path from "node:path"
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

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)))


app.use("/server/admins", adminRouter)
app.use("/server/instructores", instructoresRouter)
app.use("/server/aprendices", aprendicesRouter)
app.use("/server/formaciones", formacionesRouter)
app.use("/server/instructores-aprendices", instructoresAprendicesRouter)
app.use("/server/aprendices-formaciones", aprendicesFormacionesRouter)
app.use("/server/megajs", megajsRouter)

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
})

app.listen(dotenvConfig.PORT, async () => {
  await mega.ready.then(() => console.log("Conectado a MEGA"));
  console.log("Corriendo en http://localhost:" + dotenvConfig.PORT);
});