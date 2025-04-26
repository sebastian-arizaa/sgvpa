import { QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { InstructoresAprendicesType } from "../../types";


interface InstructoresAprendicesInterface {
  conseguirTodos(): Promise<QueryResult>;
  conseguirUno(id: number): Promise<QueryResult>;
  crear(data: InstructoresAprendicesType): Promise<QueryResult>;
  actualizar(id: number, data: InstructoresAprendicesType): Promise<QueryResult>;
  eliminar(id: number): Promise<QueryResult>;
}

class InstructoresAprendices implements InstructoresAprendicesInterface {
  async conseguirTodos() {
    const [rows] = await pool.query('SELECT * FROM instructores_aprendices');
    return rows;
  }

  async conseguirUno(id: number) {
    const [rows] = await pool.query('SELECT * FROM instructores_aprendices WHERE id = ?', [id]);
    return rows;
  }

  async crear(data: InstructoresAprendicesType) {
    const { instructor_id, aprendiz_id, activa } = data;
    const [result] = await pool.query(
      'INSERT INTO instructores_aprendices (instructor_id, aprendiz_id, activa) VALUES (?, ?, ?)',
      [instructor_id, aprendiz_id, activa]
    );
    return result;
  }

  async actualizar(id: number, data: InstructoresAprendicesType) {
    const { instructor_id, aprendiz_id, activa } = data;
    const [result] = await pool.query(
      'UPDATE instructores_aprendices SET instructor_id = ?, aprendiz_id = ?, activa = ? WHERE id = ?',
      [instructor_id, aprendiz_id, activa, id]
    );
    return result;
  }

  async eliminar(id: number) {
    const [result] = await pool.query('DELETE FROM instructores_aprendices WHERE id = ?', [id]);
    return result;
  }
}

export const instructoresAprendices = new InstructoresAprendices();