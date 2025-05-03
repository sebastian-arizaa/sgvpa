import { Request, Response } from "express";
import { formaciones } from "../../modelo/bdMysql/formaciones";
import { FormacionesType } from "../../types";
import { ErrorNoEncontrado } from "../../errores/mysql";

interface FormacionesControladorInterface {
  conseguirTodos(req: Request, res: Response): void;
  conseguirUno(req: Request, res: Response): void;
  crear(req: Request, res: Response): void;
  actualizar(req: Request, res: Response): void;
  eliminar(req: Request, res: Response): void;
}

class FormacionesControlador implements FormacionesControladorInterface {
  async conseguirTodos(_req: Request, res: Response) {
    try {
      const resultado = await formaciones.conseguirTodos();
      res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async conseguirUno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await formaciones.conseguirUno(id);
      res.json(resultado);
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorNoEncontrado) return res.status(404).send(error.mensaje)
      res.status(500).end()
    }
  }
  async crear(req: Request, res: Response) {
    try {
      const resultado = await formaciones.crear(req.body);
      res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await formaciones.actualizar(id, req.body);
      res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await formaciones.eliminar(id);
      res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
}

export const formacionesControlador = new FormacionesControlador();