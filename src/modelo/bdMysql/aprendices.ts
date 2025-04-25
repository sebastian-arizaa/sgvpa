import { QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";

interface aprendicesInterface {
  conseguirTodosAprendices(): Promise<QueryResult>;
}

class Aprendices implements aprendicesInterface {
  async conseguirTodosAprendices() {
    const data = await pool.query("select * from aprendices where numeroIdentificacion = 2168468");
    return data[0];
  }
}

export const aprendices = new Aprendices();