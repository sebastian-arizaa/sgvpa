
import { createPool } from "mysql2/promise";
import { dotenvConfig } from "../../dotenv";

console.log("Dotenvconfig: ", dotenvConfig)
export const pool = createPool({
  host: dotenvConfig.DB_HOST,
  user: dotenvConfig.DB_USER,
  password: dotenvConfig.DB_PASSWORD,
  database: dotenvConfig.DB_NAME,
  port: Number(dotenvConfig.DB_PORT),
})

pool.getConnection().then((connection) => {
  console.log("Connectedo a la base de datos");
  connection.release();
}).catch((error) => {
  console.error("Error al conectar a la base de datos: ", error);
});