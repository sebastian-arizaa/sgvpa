
import { createPool } from "mysql2/promise";
import { dotenvConfig } from "../../server/dotenv";

export const pool = createPool({
  host: dotenvConfig.DB_HOST,
  user: dotenvConfig.DB_USER,
  password: dotenvConfig.DB_PASSWORD,
  database: dotenvConfig.DB_NAME,
  port: Number(dotenvConfig.DB_PORT),
})

pool.getConnection().then((connection) => {
  console.log("Connected to the database");
  connection.release();
}).catch((error) => {
  console.error("Error connecting to the database: ", error);
});