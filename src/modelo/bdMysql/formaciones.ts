import { FieldPacket, QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { FormacionType } from "../../types";
import { ErrorBaseDatos, ErrorConflicto, ErrorNoEncontrado } from "../../errores/mysql";

interface FormacionesInterface {
  conseguirTodos(): Promise<FormacionType[]>;
  conseguirUno(id: string): Promise<FormacionType>;
  crear(data: FormacionType): Promise<QueryResult>;
  actualizar(id: string, data: FormacionType): Promise<QueryResult>;
  eliminar(id: string): Promise<QueryResult>;
}

class Formaciones implements FormacionesInterface {
  async conseguirTodos(): Promise<FormacionType[]> {
    try {
      const [rows] = await (pool.query('SELECT * FROM formaciones') as Promise<[FormacionType[], FieldPacket[]]>);
      return rows;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async conseguirUno(id: string): Promise<FormacionType> {
    try {
      const [rows] = await (pool.query('SELECT * FROM formaciones WHERE id = ?', [id]) as Promise<[FormacionType[], FieldPacket[]]>);
      if (rows.length) {
        return rows[0];
      } else {
        throw new ErrorNoEncontrado("No hay existe esa formación con ese número de identificación")
      }
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      if (error instanceof ErrorNoEncontrado) {
        throw error
      }
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async crear(data: FormacionType): Promise<QueryResult> {
    try {
      const { id, nombre, nombre_departamento, nombre_municipio } = data;
      const [result] = await pool.query(
        'INSERT INTO formaciones (id, nombre, nombre_departamento, nombre_municipio) VALUES (?, ?, ?, ?)',
        [id, nombre, nombre_departamento, nombre_municipio]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      if (error.code == "ER_DUP_ENTRY") {
        if (error.sqlMessage.includes("PRIMARY")) throw new ErrorConflicto("Ya existe una formacion con ese número de ficha")
      }
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async actualizar(id: string, data: FormacionType): Promise<QueryResult> {
    try {
      const { nombre, nombre_municipio, nombre_departamento } = data;
      const [result] = await pool.query(
        'UPDATE formaciones SET nombre = ?, nombre_municipio = ?, nombre_departamento = ? WHERE id = ?',
        [nombre, nombre_municipio, nombre_departamento, id]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async eliminar(id: string): Promise<QueryResult> {
    try {
      const [result] = await pool.query('DELETE FROM formaciones WHERE id = ?', [id]);
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }
}

export const formaciones = new Formaciones();