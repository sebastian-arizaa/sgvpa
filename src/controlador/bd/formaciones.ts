import { Request, Response } from "express";
import { formaciones } from "../../modelo/bdMysql/formaciones";
import { ErrorBaseDatos, ErrorConflicto, ErrorNoEncontrado } from "../../errores/mysql";

interface FormacionesControladorInterface {
  conseguirTodos(req: Request, res: Response): Promise<void>;
  conseguirUno(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
}

class FormacionesControlador implements FormacionesControladorInterface {
  async conseguirTodos(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const resultado = await formaciones.conseguirTodos();
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
        const resultado = await formaciones.conseguirUno(id);
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorNoEncontrado) res.status(404).send(error.mensaje)
        if (error instanceof ErrorBaseDatos) res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async crear(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const resultado = await formaciones.crear(req.body);
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorConflicto) res.status(409).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async actualizar(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const resultado = await formaciones.actualizar(id, req.body);
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorConflicto) res.status(409).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async eliminar(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const resultado = await formaciones.eliminar(id);
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

export const formacionesControlador = new FormacionesControlador();