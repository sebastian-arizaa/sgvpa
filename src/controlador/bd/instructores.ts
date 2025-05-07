import { Request, Response } from "express";
import { instructores } from "../../modelo/bdMysql/instructores";
import { actualizarTokenAcceso, generaTokenAcceso } from "../../utils/jwt";
import { ErrorBaseDatos, ErrorConflicto, ErrorNoEncontrado } from "../../errores/mysql";

interface InstructoresControladorInterface {
  conseguirTodos(req: Request, res: Response): void;
  conseguirUno(req: Request, res: Response): void;
  crear(req: Request, res: Response): void;
  actualizar(req: Request, res: Response): void;
  eliminar(req: Request, res: Response): void;
}

class InstructoresControlador implements InstructoresControladorInterface {
  async conseguirTodos(_req: Request, res: Response) {
    try {
      const respuesta = await instructores.conseguirTodos();
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
    }
  }
  async conseguirUno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await instructores.conseguirUno(id);
      res.json(respuesta)
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorNoEncontrado) res.status(404).send(error.mensaje)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
    }
  }
  async crear(req: Request, res: Response) {
    try {
      const respuesta = await instructores.crear(req.body);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorConflicto) res.status(409).send(error.mensaje)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
    }
  }
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(req.body)
      const respuesta = await instructores.actualizar(id, req.body.data);
      if (req.body.actualizarToken) {
        actualizarTokenAcceso(res, { userTipo: "instructor", userData: req.body.data })
        res.json({ userTipo: "instructor", userData: req.body.data })
        return
      }
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorConflicto) res.status(409).send(error.mensaje)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
    }
  }
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await instructores.eliminar(id);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
    }
  }
  async ingresar(req: Request, res: Response) {
    try {
      const { id, contraseña } = req.body;
      const respuesta = await instructores.conseguirUno(id);
      generaTokenAcceso(res, { userTipo: "instructor", userData: respuesta }, respuesta, contraseña)
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
    }
  }
}

export const instructoresControlador = new InstructoresControlador();