import { QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { InstructorType } from "../../types";

interface InstructoresInterface {
  conseguirTodos(): Promise<QueryResult>;
  conseguirUno(id: string): Promise<QueryResult>;
  crear(data: InstructorType): Promise<QueryResult>;
  actualizar(id: string, data: InstructorType): Promise<QueryResult>;
  eliminar(id: string): Promise<QueryResult>;
}

class Instructores implements InstructoresInterface {
  async conseguirTodos() {
    const [rows] = await pool.query('SELECT * FROM instructores');
    return rows;
  }

  async conseguirUno(id: string) {
    const [rows] = await pool.query('SELECT * FROM instructores WHERE id = ?', [id]);
    return rows;
  }

  async crear(data: InstructorType) {
    const { id, nombre, apellidos, telefono, email, hash_contraseña, salt } = data;
    const [result] = await pool.query(
      'INSERT INTO instructores (id, nombre, apellidos, telefono, email, hash_contraseña, salt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, nombre, apellidos, telefono, email, hash_contraseña, salt]
    );
    return result;
  }

  async actualizar(id: string, data: InstructorType) {
    const { id: nuevoId, nombre, apellidos, telefono, email, hash_contraseña, salt } = data;
    const [result] = await pool.query(
      'UPDATE instructores SET id = ?, nombre = ?, apellidos = ?, telefono = ?, email = ?, hash_contraseña = ?, salt = ? WHERE id = ?',
      [nuevoId, nombre, apellidos, telefono, email, hash_contraseña, salt, id]
    );
    return result;
  }

  async eliminar(id: string) {
    const [result] = await pool.query('DELETE FROM instructores WHERE id = ?', [id]);
    return result;
  }
}

export const instructores = new Instructores();