import { FieldPacket, QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { AprendicesFormacionesType } from "../../types";
import { ErrorBaseDatos, ErrorNoEncontrado } from "../../errores/mysql";
import { AprendicesFormacionesInterface } from "../../types/modeloInterfaces";

class AprendicesFormaciones implements AprendicesFormacionesInterface {
  async conseguirTodos(): Promise<AprendicesFormacionesType[]> {
    try {
      const [rows] = await (pool.query('SELECT * FROM aprendices_formaciones') as Promise<[AprendicesFormacionesType[], FieldPacket[]]>);
      return rows;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async conseguirUno(id: number): Promise<AprendicesFormacionesType> {
    try {
      const [rows] = await (pool.query('SELECT * FROM aprendices_formaciones WHERE id = ?', [id]) as Promise<[AprendicesFormacionesType[], FieldPacket[]]>);
      if (rows.length) {
        return rows[0]
      } else {
        throw new ErrorNoEncontrado("No existe la relacion aprendices_formaciones con ese id")
      }
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async crear(data: AprendicesFormacionesType): Promise<QueryResult> {
    try {
      const { formacion_id, aprendiz_id, activa } = data;
      const [result] = await pool.query(
        'INSERT INTO aprendices_formaciones (formacion_id, aprendiz_id, activa) VALUES (?, ?, ?)',
        [formacion_id, aprendiz_id, activa]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async actualizar(id: number, data: AprendicesFormacionesType): Promise<QueryResult> {
    try {
      const { formacion_id, aprendiz_id, activa } = data;
      const [result] = await pool.query(
        'UPDATE aprendices_formaciones SET formacion_id = ?, aprendiz_id = ?, activa = ? WHERE id = ?',
        [formacion_id, aprendiz_id, activa, id]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async eliminar(id: number): Promise<QueryResult> {
    try {
      const [result] = await pool.query('DELETE FROM aprendices_formaciones WHERE id = ?', [id]);
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }
}

export const aprendicesFormaciones = new AprendicesFormaciones();