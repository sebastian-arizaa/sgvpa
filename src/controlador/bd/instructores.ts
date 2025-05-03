import { Request, Response } from "express";
import { instructores } from "../../modelo/bdMysql/instructores";
import { generaTokenAcceso } from "../../utils/jwt";

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
      res.status(500).end()
    }
  }
  async conseguirUno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await instructores.conseguirUno(id);
      res.json(respuesta)
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async crear(req: Request, res: Response) {
    try {
      const respuesta = await instructores.crear(req.body);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await instructores.actualizar(id, req.body);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await instructores.eliminar(id);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async ingresar(req: Request, res: Response) {
    try {
      const { id, contraseña } = req.body;
      const respuesta = await instructores.conseguirUno(id);
      generaTokenAcceso(res, { userTipo: "instructor", userData: respuesta }, respuesta, contraseña)
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
}

export const instructoresControlador = new InstructoresControlador();