import { Request, Response } from "express";
import { aprendices } from "../../modelo/bdMysql/aprendices";
import { actualizarTokenAcceso, generaTokenAcceso } from "../../utils/jwt";
import { ErrorBaseDatos, ErrorConflicto, ErrorNoEncontrado, ErrorViolacionLlaveForanea } from "../../errores/mysql";

interface AprendicesControladorInterface {
  conseguirTodos(req: Request, res: Response): void;
  conseguirUno(req: Request, res: Response): void;
  conseguirTodosPorInstructor(req: Request, res: Response): void;
  conseguirTodosPorFormacion(req: Request, res: Response): void;
  crear(req: Request, res: Response): void;
  actualizar(req: Request, res: Response): void;
  eliminar(req: Request, res: Response): void;
}

class AprendicesControlador implements AprendicesControladorInterface {
  async conseguirTodos(_req: Request, res: Response) {
    try {
      const respuesta = await aprendices.conseguirTodos();
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async conseguirUno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.conseguirUno(id);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorNoEncontrado) res.status(404).send(error.mensaje)
      if (error instanceof ErrorBaseDatos) res.status(500).end()
    }
  }
  async conseguirTodosPorInstructor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.conseguirTodosPorInstructor(id);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async conseguirTodosPorFormacion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.conseguirTodosPorFormacion(id);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async crear(req: Request, res: Response) {
    try {
      const respuesta = await aprendices.crear(req.body);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error.mensaje)
      if (error instanceof ErrorConflicto) res.status(409).send(error.mensaje)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      if (error instanceof ErrorViolacionLlaveForanea) res.status(404).send(error.mensaje)
    }
  }
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.actualizar(id, req.body.data);
      if (req.body.actualizarToken) {
        actualizarTokenAcceso(res, { userTipo: "aprendiz", userData: req.body.data })
        res.json({ userTipo: "aprendiz", userData: req.body.data })
        return
      }
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorConflicto) res.status(409).send(error.mensaje)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      if (error instanceof ErrorViolacionLlaveForanea) res.status(404).send(error.mensaje)
    }
  }
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.eliminar(id);
      res.json(respuesta);
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async ingresar(req: Request, res: Response) {
    try {
      const { id, contraseña } = req.body;
      const respuesta = await aprendices.conseguirUno(id);
      generaTokenAcceso(res, { userTipo: "aprendiz", userData: respuesta }, respuesta, contraseña)
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
}

export const aprendicesControlador = new AprendicesControlador();
