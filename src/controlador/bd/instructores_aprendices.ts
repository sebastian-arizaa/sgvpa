import { Request, Response } from "express";
import { instructoresAprendices } from "../../modelo/bdMysql/instructores_aprendices";
import { ErrorBaseDatos, ErrorConflicto, ErrorViolacionLlaveForanea } from "../../errores/mysql";

interface InstructoresAprendicesControladorInterface {
  conseguirTodos(req: Request, res: Response): Promise<void>;
  conseguirUno(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
}

class InstructoresAprendicesControlador implements InstructoresAprendicesControladorInterface {
  async conseguirTodos(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const resultado = await instructoresAprendices.conseguirTodos();
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
        const resultado = await instructoresAprendices.conseguirUno(Number(id));
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
        const resultado = await instructoresAprendices.crear(req.body);
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
        const resultado = await instructoresAprendices.actualizar(Number(id), req.body);
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
        const resultado = await instructoresAprendices.eliminar(Number(id));
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

export const instructoresAprendicesControlador = new InstructoresAprendicesControlador();