import { FieldPacket, QueryResult } from "mysql2";
import { pool } from "../../server/conexion/bdMysql";
import { ErrorBaseDatos } from "../../errores/mysql";
import { ActaType } from "../../types";

interface ActasInterface {
  conseguirTodasPorAprendiz(id: string): Promise<ActaType[]>
  agregarTodasPorAprendiz(aprendizId: string, formacionId: string, actaId: string[], nombre_directorio: string): Promise<QueryResult>
  actulizarUna(id: string, actaData: ActaType): Promise<QueryResult>
}

class Actas implements ActasInterface {
  async conseguirTodasPorAprendiz(id: string): Promise<ActaType[]> {
    try {
      const [rows] = await (pool.query("SELECT * FROM actas WHERE aprendiz_id = ?", [id]) as Promise<[ActaType[], FieldPacket[]]>)
      return rows
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }
  async agregarTodasPorAprendiz(aprendizId: string, formacionId: string, actasId: string[], nombre_directorio: string): Promise<QueryResult> {
    try {
      const [rows] = await pool.query(`
        INSERT INTO actas (id, nombre, aprendiz_id, formacion_id, plazo_maximo, cerrada, entregada, nombre_directorio)
        VALUES 
        (?, "Acta 1", ?, ?, NULL, 1, 0, ?),
        (?, "Acta 2", ?, ?, NULL, 1, 0, ?),
        (?, "Acta 3", ?, ?, NULL, 1, 0, ?)
      `, [actasId[0], aprendizId, formacionId, nombre_directorio, actasId[1], aprendizId, formacionId, nombre_directorio, actasId[2], aprendizId, formacionId, nombre_directorio])
      return rows
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }
  async actulizarUna(id: string, actaData: ActaType): Promise<QueryResult> {
    try {
      const { id: nuevaId, nombre, aprendiz_id, plazo_maximo, cerrada, entregada, estado, nombre_archivo, nombre_directorio } = actaData
      const [rows] = await pool.query(`
        UPDATE actas 
        SET id = ?, nombre = ?, aprendiz_id = ?, plazo_maximo = ?, cerrada = ?, entregada = ?, estado = ?, nombre_archivo = ?, nombre_directorio = ?
        WHERE id = ?
      `, [nuevaId, nombre, aprendiz_id, plazo_maximo, cerrada, entregada, estado, nombre_archivo, nombre_directorio, id])
      return rows
    } catch (error: any) {
      console.log("Error en la base de datos: ", error)
      throw new ErrorBaseDatos("Error en la base de datos")
    }
  }
}

export const actas = new Actas();