import { Request, Response } from "express";
import { ErrorBaseDatos, ErrorConflicto, ErrorViolacionLlaveForanea } from "../../errores/mysql";
import { InstructoresAprendicesInterface } from "../../types/modeloInterfaces";

interface InstructoresAprendicesControladorInterface {
  instructoresAprendicesModelo: InstructoresAprendicesInterface;
  conseguirTodos(req: Request, res: Response): Promise<void>;
  conseguirUno(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
}

export class InstructoresAprendicesControlador implements InstructoresAprendicesControladorInterface {
  instructoresAprendicesModelo: InstructoresAprendicesInterface;
  constructor(instructoresAprendicesModelo: InstructoresAprendicesInterface) {
    this.instructoresAprendicesModelo = instructoresAprendicesModelo
  }
  async conseguirTodos(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const resultado = await this.instructoresAprendicesModelo.conseguirTodos();
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async conseguirUno(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const resultado = await this.instructoresAprendicesModelo.conseguirUno(Number(id));
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async crear(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const resultado = await this.instructoresAprendicesModelo.crear(req.body);
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorConflicto) res.status(409).send(error.mensaje)
        if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
        if (error instanceof ErrorViolacionLlaveForanea) res.status(404).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async actualizar(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const resultado = await this.instructoresAprendicesModelo.actualizar(Number(id), req.body);
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async eliminar(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const resultado = await this.instructoresAprendicesModelo.eliminar(Number(id));
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
}