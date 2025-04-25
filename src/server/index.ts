import express from "express";
import cors from "cors";
import path from "node:path"
import { dotenvConfig } from "./dotenv";
import { adminRouter } from "./rutas/admins";
import { aprendicesRouter } from "./rutas/aprendices";
import { instructoresRouter } from "./rutas/instructores";
import { formacionesRouter } from "./rutas/formaciones";
import { __dirname } from "./globals";
import { mega } from "./conexion/megajs";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)))


app.use("/server/admins", adminRouter)
app.use("/server/instructores", instructoresRouter)
app.use("/server/aprendices", aprendicesRouter)
app.use("/server/formaciones", formacionesRouter)

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
})

app.listen(dotenvConfig.PORT, async () => {
  console.log("Conectado a la base de datos");
  await mega.ready.then(() => console.log("Conectado a MEGA"));
  console.log("Corriendo en http://localhost:" + dotenvConfig.PORT);
});