import { QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { AprendicesFormacionesType } from "../../types";

interface AprendicesFormacionesInterface {
  conseguirTodos(): Promise<QueryResult>;
  conseguirUno(id: number): Promise<QueryResult>;
  crear(data: AprendicesFormacionesType): Promise<QueryResult>;
  actualizar(id: number, data: AprendicesFormacionesType): Promise<QueryResult>;
  eliminar(id: number): Promise<QueryResult>;
}

class AprendicesFormaciones implements AprendicesFormacionesInterface {
  async conseguirTodos() {
    const [rows] = await pool.query('SELECT * FROM aprendices_formaciones');
    return rows;
  }

  async conseguirUno(id: number) {
    const [rows] = await pool.query('SELECT * FROM aprendices_formaciones WHERE id = ?', [id]);
    return rows;
  }

  async crear(data: AprendicesFormacionesType) {
    const { formacion_id, aprendiz_id, activa } = data;
    const [result] = await pool.query(
      'INSERT INTO aprendices_formaciones (formacion_id, aprendiz_id, activa) VALUES (?, ?, ?)',
      [formacion_id, aprendiz_id, activa]
    );
    return result;
  }

  async actualizar(id: number, data: AprendicesFormacionesType) {
    const { formacion_id, aprendiz_id, activa } = data;
    const [result] = await pool.query(
      'UPDATE aprendices_formaciones SET formacion_id = ?, aprendiz_id = ?, activa = ? WHERE id = ?',
      [formacion_id, aprendiz_id, activa, id]
    );
    return result;
  }

  async eliminar(id: number) {
    const [result] = await pool.query('DELETE FROM aprendices_formaciones WHERE id = ?', [id]);
    return result;
  }
}

export const aprendicesFormaciones = new AprendicesFormaciones();