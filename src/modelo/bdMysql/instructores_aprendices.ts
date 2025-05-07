import { FieldPacket, QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { InstructoresAprendicesType } from "../../types";
import { ErrorBaseDatos, ErrorConflicto, ErrorNoEncontrado, ErrorViolacionLlaveForanea } from "../../errores/mysql";

interface InstructoresAprendicesInterface {
  conseguirTodos(): Promise<InstructoresAprendicesType[]>;
  conseguirUno(id: number): Promise<InstructoresAprendicesType>;
  crear(data: InstructoresAprendicesType): Promise<QueryResult>;
  actualizar(id: number, data: InstructoresAprendicesType): Promise<QueryResult>;
  eliminar(id: number): Promise<QueryResult>;
}

class InstructoresAprendices implements InstructoresAprendicesInterface {
  async conseguirTodos(): Promise<InstructoresAprendicesType[]> {
    try {
      const [rows] = await (pool.query('SELECT * FROM instructores_aprendices') as Promise<[InstructoresAprendicesType[], FieldPacket[]]>);
      return rows;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async conseguirUno(id: number): Promise<InstructoresAprendicesType> {
    try {
      const [rows] = await (pool.query('SELECT * FROM instructores_aprendices WHERE id = ?', [id]) as Promise<[InstructoresAprendicesType[], FieldPacket[]]>);
      if (rows.length) {
        return rows[0];
      } else {
        throw new ErrorNoEncontrado("No hay existe la relacion instrucotres_aprendices con ese número de identificación")
      }
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async crear(data: InstructoresAprendicesType): Promise<QueryResult> {
    try {
      const { id, instructor_id, aprendiz_id, activa } = data;
      const [result] = await pool.query(
        'INSERT INTO instructores_aprendices (id, instructor_id, aprendiz_id, activa) VALUES (?, ?, ?, ?)',
        [id, instructor_id, aprendiz_id, activa]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      if (error.code === "ER_DUP_ENTRY") {
        if (error.sqlMessage.includes("PRIMARY")) throw new ErrorConflicto('El instructor ya tiene asignado este aprendiz');
      } else if (error.code.includes("ER_NO_REFERENCED_ROW")) {
        if (error.sqlMessage.includes("aprendices")) throw new ErrorViolacionLlaveForanea("No existe un aprendiz con es número identificación")
        if (error.sqlMessage.includes("instructores")) throw new ErrorViolacionLlaveForanea("No existe un instructor con es número identificación")
      }
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async actualizar(id: number, data: InstructoresAprendicesType): Promise<QueryResult> {
    try {
      const { instructor_id, aprendiz_id, activa } = data;
      const [result] = await pool.query(
        'UPDATE instructores_aprendices SET instructor_id = ?, aprendiz_id = ?, activa = ? WHERE id = ?',
        [instructor_id, aprendiz_id, activa, id]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async eliminar(id: number): Promise<QueryResult> {
    try {
      const [result] = await pool.query('DELETE FROM instructores_aprendices WHERE id = ?', [id]);
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }
}

export const instructoresAprendices = new InstructoresAprendices();