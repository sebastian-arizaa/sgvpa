import { Request, Response } from "express";
import { instructoresAprendices } from "../../modelo/bdMysql/instructores_aprendices";

interface InstructoresAprendicesControladorInterface {
  conseguirTodos(req: Request, res: Response): void;
  conseguirUno(req: Request, res: Response): void;
  crear(req: Request, res: Response): void;
  actualizar(req: Request, res: Response): void;
  eliminar(req: Request, res: Response): void;
}

class InstructoresAprendicesControlador implements InstructoresAprendicesControladorInterface {
  async conseguirTodos(_req: Request, res: Response) {
    try {
      const resultado = await instructoresAprendices.conseguirTodos();
      res.json(resultado);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async conseguirUno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await instructoresAprendices.conseguirUno(Number(id));
      res.json(resultado);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async crear(req: Request, res: Response) {
    try {
      const resultado = await instructoresAprendices.crear(req.body);
      res.json(resultado);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await instructoresAprendices.actualizar(Number(id), req.body);
      res.json(resultado);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await instructoresAprendices.eliminar(Number(id));
      res.json(resultado);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
}

export const instructoresAprendicesControlador = new InstructoresAprendicesControlador();