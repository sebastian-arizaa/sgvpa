import { FieldPacket, QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { AprendizType, InnerAprendizFormacionType, InnerAprendizInstructorFormacionType } from "../../types";
import { ErrorBaseDatos, ErrorConflicto, ErrorNoEncontrado, ErrorViolacionLlaveForanea } from "../../errores/mysql";
import { AprendicesInterface } from "../../types/modeloInterfaces";

class Aprendices implements AprendicesInterface {
  async conseguirTodos(): Promise<AprendizType[]> {
    try {
      const [rows] = await (pool.query('SELECT * FROM aprendices') as Promise<[AprendizType[], FieldPacket[]]>);
      return rows;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async conseguirUno(id: string): Promise<AprendizType> {
    try {
      const [rows] = await (pool.query('SELECT * FROM aprendices WHERE id = ?', [id]) as Promise<[AprendizType[], FieldPacket[]]>);
      if (rows.length) {
        return rows[0];
      } else {
        throw new ErrorNoEncontrado("No existe un aprendiz con ese id")
      }
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      if (error instanceof ErrorNoEncontrado) {
        throw error
      }
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async conseguirTodosPorInstructor(id: string): Promise<InnerAprendizInstructorFormacionType[]> {
    console.log("🚀 ~ Aprendices ~ conseguirTodosPorInstructor ~ id:", id)
    try {
      const [rows] = await (pool.query(`SELECT
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
        [id]) as Promise<[InnerAprendizInstructorFormacionType[], FieldPacket[]]>);
      if (rows.length) {
        return rows;
      } else {
        throw new ErrorNoEncontrado("No existen aprendices relacionados con ese instructor")
      }
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }

  async conseguirTodosPorFormacion(id: string): Promise<InnerAprendizFormacionType[]> {
    try {
      const [rows] = await (pool.query(`SELECT
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
        [id]) as Promise<[InnerAprendizFormacionType[], FieldPacket[]]>);
      if (rows.length) {
        return rows;
      } else {
        throw new ErrorNoEncontrado("No existen aprendices relacionados con esa formación")
      }
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }


  async crear(data: AprendizType): Promise<QueryResult> {
    try {
      const { id, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id, } = data;
      const [result] = await pool.query(
        'INSERT INTO aprendices (id, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes("email")) throw new ErrorConflicto('Ya existe un aprendiz con ese correo electrónico.');
        if (error.sqlMessage.includes("PRIMARY")) throw new ErrorConflicto('Ya existe un aprendiz con ese número identificación.');
      } else if (error.code.includes("ER_NO_REFERENCED_ROW")) {
        if (error.sqlMessage.includes("formaciones")) throw new ErrorViolacionLlaveForanea('No existe una formacion con ese numero identificación.');
      } else {
        throw new ErrorBaseDatos("Error al crear el aprendiz en la base de datos.")
      }
      throw error
    }
  }

  async actualizar(id: string, data: AprendizType): Promise<QueryResult> {
    try {
      console.log(data)
      const { id: nuevoId, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id } = data;
      const [result] = await pool.query(
        'UPDATE aprendices SET id = ?, nombre = ?, apellidos = ?, telefono = ?, email = ?, hash_contraseña = ?, salt = ?, formacion_actual_id = ? WHERE id = ?',
        [nuevoId, nombre, apellidos, telefono, email, hash_contraseña, salt, formacion_actual_id, id]
      );
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes("email")) throw new ErrorConflicto('Ya existe un aprendiz con ese correo electrónico.');
        if (error.sqlMessage.includes("PRIMARY")) throw new ErrorConflicto('Ya existe un aprendiz con ese número identificación.');
      } else if (error.code.includes("ER_NO_REFERENCED_ROW")) {
        if (error.sqlMessage.includes("formaciones")) throw new ErrorViolacionLlaveForanea('No existe una formacion con ese numero identificación.');
      } else {
        throw new ErrorBaseDatos("Error al crear el aprendiz en la base de datos.")
      }
      throw error
    }
  }

  async eliminar(id: string): Promise<QueryResult> {
    try {
      const [result] = await pool.query('DELETE FROM aprendices WHERE id = ?', [id]);
      return result;
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }
}

export const aprendices = new Aprendices();
