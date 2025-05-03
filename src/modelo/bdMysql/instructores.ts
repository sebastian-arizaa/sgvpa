import { FieldPacket, QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { InstructorType } from "../../types";
import { ErrorBaseDatos, ErrorNoEncontrado } from "../../errores/mysql";

interface InstructoresInterface {
  conseguirTodos(): Promise<InstructorType[]>;
  conseguirUno(id: string): Promise<InstructorType>;
  crear(data: InstructorType): Promise<QueryResult>;
  actualizar(id: string, data: InstructorType): Promise<QueryResult>;
  eliminar(id: string): Promise<QueryResult>;
}

class Instructores implements InstructoresInterface {
  async conseguirTodos(): Promise<InstructorType[]> {
    try {
      const [rows] = await (pool.query('SELECT * FROM instructores') as Promise<[InstructorType[], FieldPacket[]]>);
      return rows;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async conseguirUno(id: string): Promise<InstructorType> {
    try {
      const [rows] = await (pool.query('SELECT * FROM instructores WHERE id = ?', [id]) as Promise<[InstructorType[], FieldPacket[]]>);
      if (rows.length) {
        return rows[0];
      } else {
        throw new ErrorNoEncontrado("No existe un instructor con ese id")
      }
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async crear(data: InstructorType): Promise<QueryResult> {
    try {
      const { id, nombre, apellidos, telefono, email, hash_contraseña, salt } = data;
      const [result] = await pool.query(
        'INSERT INTO instructores (id, nombre, apellidos, telefono, email, hash_contraseña, salt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, nombre, apellidos, telefono, email, hash_contraseña, salt]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async actualizar(id: string, data: InstructorType): Promise<QueryResult> {
    try {
      const { id: nuevoId, nombre, apellidos, telefono, email, hash_contraseña, salt } = data;
      const [result] = await pool.query(
        'UPDATE instructores SET id = ?, nombre = ?, apellidos = ?, telefono = ?, email = ?, hash_contraseña = ?, salt = ? WHERE id = ?',
        [nuevoId, nombre, apellidos, telefono, email, hash_contraseña, salt, id]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async eliminar(id: string): Promise<QueryResult> {
    try {
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
    const [result] = await pool.query('DELETE FROM instructores WHERE id = ?', [id]);
    return result;
  }
}

export const instructores = new Instructores();