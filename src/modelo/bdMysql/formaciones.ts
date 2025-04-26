import { QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { FormacionesType } from "../../types";

interface FormacionesInterface {
  conseguirTodos(): Promise<QueryResult>;
  conseguirUno(id: string): Promise<QueryResult>;
  crear(data: FormacionesType): Promise<QueryResult>;
  actualizar(id: string, data: FormacionesType): Promise<QueryResult>;
  eliminar(id: string): Promise<QueryResult>;
}

class Formaciones implements FormacionesInterface {
  async conseguirTodos() {
    const [rows] = await pool.query('SELECT * FROM formaciones');
    return rows;
  }

  async conseguirUno(id: string) {
    const [rows] = await pool.query('SELECT * FROM formaciones WHERE id = ?', [id]);
    return rows;
  }

  async crear(data: FormacionesType) {
    const { id, nombre, nombre_departamento, nombre_municipio } = data;
    const [result] = await pool.query(
      'INSERT INTO formaciones (id, nombre, nombre_departamento, nombre_municipio) VALUES (?, ?, ?, ?)',
      [id, nombre, nombre_departamento, nombre_municipio]
    );
    return result;
  }

  async actualizar(id: string, data: FormacionesType) {
    const { nombre, nombre_municipio, nombre_departamento } = data;
    const [result] = await pool.query(
      'UPDATE formaciones SET nombre = ?, nombre_municipio = ?, nombre_departamento = ? WHERE id = ?',
      [nombre, nombre_municipio, nombre_departamento, id]
    );
    return result;
  }

  async eliminar(id: string) {
    const [result] = await pool.query('DELETE FROM formaciones WHERE id = ?', [id]);
    return result;
  }
}

export const formaciones = new Formaciones();