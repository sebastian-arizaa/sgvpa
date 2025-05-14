import { Request, Response } from "express";
import { ErrorBaseDatos, ErrorConflicto, ErrorNoEncontrado } from "../../errores/mysql";
import { FormacionesInterface } from "../../types/modeloInterfaces";

interface FormacionesControladorInterface {
  formacionesModelo: FormacionesInterface;
  conseguirTodos(req: Request, res: Response): Promise<void>;
  conseguirUno(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
}

export class FormacionesControlador implements FormacionesControladorInterface {
  formacionesModelo: FormacionesInterface;
  constructor(formacionesModelo: FormacionesInterface) {
    this.formacionesModelo = formacionesModelo
  }
  async conseguirTodos(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const resultado = await this.formacionesModelo.conseguirTodos();
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
        const resultado = await this.formacionesModelo.conseguirUno(id);
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
        const resultado = await this.formacionesModelo.crear(req.body);
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
        const resultado = await this.formacionesModelo.actualizar(id, req.body);
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
        const resultado = await this.formacionesModelo.eliminar(id);
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