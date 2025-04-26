import { QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";

interface AdminsInterface {
  conseguirUno(id: string): Promise<QueryResult>
}

class Admins implements AdminsInterface {
  async conseguirUno(id: string) {
    const [rows] = await pool.query("SELECT * FROM admins WHERE id = ?", [id])
    return rows
  }
}

export const admins = new Admins();