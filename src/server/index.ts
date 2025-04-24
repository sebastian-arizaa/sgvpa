import {Storage} from "megajs"
import { dotenvConfig } from "./dotenv";
import { pool } from "../modelo/bdMysql";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


const mega = new Storage({
  email: dotenvConfig.MEGAJS_EMAIL,
  password: dotenvConfig.MEGAJS_PASSWORD,
  autologin: true
});



app.get("/", async (_req, res) => {
  const data = await pool.query("select * from aprendices where numeroIdentificacion = 2168468");
  console.log("Data: ", data[0]);
  res.send("Hola mundo");
})


app.listen(dotenvConfig.PORT, async () => {
  console.log("Conectado a la base de datos");
  await mega.ready.then(() => console.log("Conectado a MEGA"));
  console.log("Corriendo en http://localhost:" + dotenvConfig.PORT);
});