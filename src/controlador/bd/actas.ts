import { Request, Response } from "express";
import { ErrorBaseDatos } from "../../errores/mysql";
import { ActasInterface } from "../../types/modeloInterfaces";

interface ActasControladorInterface {
  actaModelo: ActasInterface,
  conseguirTodasPorAprendiz(req: Request, res: Response): Promise<void>;
  agregarTodasPorAprendiz(req: Request, res: Response): Promise<void>;
  actualizarUna(req: Request, res: Response): Promise<void>;
}

export class ActasControlador implements ActasControladorInterface {
  actaModelo: ActasInterface;
  constructor(actaModelo: ActasInterface) {
    this.actaModelo = actaModelo
  }

  async conseguirTodasPorAprendiz(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const respuesta = await this.actaModelo.conseguirTodasPorAprendiz(id)
        res.json(respuesta)
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async agregarTodasPorAprendiz(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { aprendizId, formacionId, actasId, nombre_directorio } = req.body;
        const respuesta = await this.actaModelo.agregarTodasPorAprendiz(aprendizId, formacionId, actasId, nombre_directorio);
        res.json(respuesta)
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async actualizarUna(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params
        const respuesta = await this.actaModelo.actulizarUna(id, req.body);
        res.json(respuesta)
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
}

// export const actasControlador = new ActasControlador(actas);
