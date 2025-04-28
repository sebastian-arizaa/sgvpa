import { QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { AprendizType } from "../../types";

interface AprendicesInterface {
  conseguirTodos(): Promise<QueryResult>;
  conseguirUno(id: string): Promise<QueryResult>;
  conseguirTodosPorInstructor(id: string): Promise<QueryResult>
  conseguirTodosPorFormacion(id: string): Promise<QueryResult>
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

  async conseguirTodosPorInstructor(id: string) {
    const [rows] = await pool.query(`SELECT
      a.id,
      a.nombre,
      a.apellidos,
      a.telefono,
      a.email,
      a.hash_contraseña,
      a.salt,
      ia.activa,
      a.formacion_actual_id,
      f.nombre AS nombre_formacion,
      f.id AS formacion_id,
      f.nombre_departamento,
      f.nombre_municipio
      FROM
        aprendices a
      JOIN
        instructores_aprendices ia ON ia.aprendiz_id = a.id
      JOIN
          formaciones f ON f.id = a.formacion_actual_id
      WHERE
          ia.instructor_id = ?`, 
    [id]);
    return rows;
  }

  async conseguirTodosPorFormacion(id: string) {
    const [rows] = await pool.query(`SELECT
	    a.id,
      a.nombre,
      a.apellidos,
      a.telefono,
      a.email,
      a.hash_contraseña,
      a.salt,
      af.activa,
      a.formacion_actual_id,
      f.nombre AS nombre_formacion,
      f.id AS formacion_id,
      f.nombre_departamento,
      f.nombre_municipio
      FROM 
        aprendices a 
      JOIN 
        aprendices_formaciones af on af.aprendiz_id = a.id 
      JOIN
        formaciones f ON f.id = af.formacion_id
      WHERE af.formacion_id = ?`, 
    [id]);
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
