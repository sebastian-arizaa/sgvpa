import { Request, Response } from "express";
import { actas } from "../../modelo/bdMysql/actas";
import { ErrorBaseDatos } from "../../errores/mysql";

interface ActasControladorInterface {
  conseguirTodasPorAprendiz(req: Request, res: Response): Promise<void>;
  agregarTodasPorAprendiz(req: Request, res: Response): Promise<void>;
  actualizarUna(req: Request, res: Response): Promise<void>;
}

class ActasControlador implements ActasControladorInterface {
  async conseguirTodasPorAprendiz(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const respuesta = await actas.conseguirTodasPorAprendiz(id)
      res.json(respuesta)
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)

    }
  }
  async agregarTodasPorAprendiz(req: Request, res: Response): Promise<void> {
    try {
      const { aprendizId, formacionId, actasId, nombre_directorio } = req.body;
      const respuesta = await actas.agregarTodasPorAprendiz(aprendizId, formacionId, actasId, nombre_directorio);
      res.json(respuesta)
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
    }
  }
  async actualizarUna(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const respuesta = await actas.actulizarUna(id, req.body);
      res.json(respuesta)
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
    }
  }
}

export const actasControlador = new ActasControlador();
