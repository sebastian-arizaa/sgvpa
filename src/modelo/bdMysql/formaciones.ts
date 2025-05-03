import { FieldPacket, QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { FormacionesType } from "../../types";
import { ErrorNoEncontrado } from "../../errores/mysql";

interface FormacionesInterface {
  conseguirTodos(): Promise<FormacionesType[]>;
  conseguirUno(id: string): Promise<FormacionesType[]>;
  crear(data: FormacionesType): Promise<QueryResult>;
  actualizar(id: string, data: FormacionesType): Promise<QueryResult>;
  eliminar(id: string): Promise<QueryResult>;
}

class Formaciones implements FormacionesInterface {
  async conseguirTodos() {
    const [rows] = await (pool.query('SELECT * FROM formaciones') as Promise<[FormacionesType[], FieldPacket[]]>);
    return rows;
  }

  async conseguirUno(id: string) {
    const [rows] = await (pool.query('SELECT * FROM formaciones WHERE id = ?', [id]) as Promise<[FormacionesType[], FieldPacket[]]>);
    if (rows.length) {
      return rows;
    } else {
      throw new ErrorNoEncontrado("No hay existe esa formación con ese número de identificación")
    }
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