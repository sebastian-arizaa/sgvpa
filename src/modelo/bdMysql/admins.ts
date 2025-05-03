import { FieldPacket } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { ErrorBaseDatos, ErrorNoEncontrado } from "../../errores/mysql";
import { AdminType } from "../../types";

interface AdminsInterface {
  conseguirUno(id: string): Promise<AdminType>
}

class Admins implements AdminsInterface {
  async conseguirUno(id: string): Promise<AdminType> {
    try {
      const [rows] = await (pool.query("SELECT * FROM admins WHERE id = ?", [id]) as Promise<[AdminType[], FieldPacket[]]>)
      if (rows.length) {
        return rows[0]
      } else {
        throw new ErrorNoEncontrado("No existe un admin con ese id")
      }
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }
}

export const admins = new Admins();