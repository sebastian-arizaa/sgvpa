import { QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { AprendizType } from "../../types";

interface AprendicesInterface {
  conseguirTodos(): Promise<QueryResult>;
  conseguirUno(id: string): Promise<QueryResult>;
  crear(data: AprendizType): Promise<QueryResult>;
  actualizar(id: string, data: AprendizType): Promise<QueryResult>;
  eliminar(id: string): Promise<QueryResult>;
}

class Aprendices implements AprendicesInterface {
  async conseguirTodos() {
    const [rows] = await pool.query('SELECT * FROM aprendices');
    return rows;
  }

  async conseguirUno(id: string) {
    const [rows] = await pool.query('SELECT * FROM aprendices WHERE id = ?', [id]);
    return rows;
  }

  async crear(data: AprendizType) {
    const { id, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id, } = data;
    const [result] = await pool.query(
      'INSERT INTO aprendices (id, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id]
    );
    return result;
  }

  async actualizar(id: string, data: AprendizType) {
    const { id: nuevoId, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id } = data;
    const [result] = await pool.query(
      'UPDATE aprendices SET id = ?, nombre = ?, apellidos = ?, telefono = ?, email = ?, hash_contraseña = ?, salt = ?, formacion_actual_id = ? WHERE id = ?',
      [nuevoId, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id, id]
    );
    return result;
  }

  async eliminar(id: string) {
    const [result] = await pool.query('DELETE FROM aprendices WHERE id = ?', [id]);
    return result;
  }
}

export const aprendices = new Aprendices();
