import { Request, Response } from "express";
import { actualizarTokenAcceso, generaTokenAcceso } from "../../utils/jwt";
import { ErrorBaseDatos, ErrorConflicto, ErrorNoEncontrado, ErrorViolacionLlaveForanea } from "../../errores/mysql";
import { AprendicesInterface } from "../../types/modeloInterfaces";

interface AprendicesControladorInterface {
  aprendicesModelo: AprendicesInterface;
  conseguirTodos(req: Request, res: Response): Promise<void>;
  conseguirUno(req: Request, res: Response): Promise<void>;
  conseguirTodosPorInstructor(req: Request, res: Response): Promise<void>;
  conseguirTodosPorFormacion(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
}

export class AprendicesControlador implements AprendicesControladorInterface {
  aprendicesModelo: AprendicesInterface;
  constructor(aprendicesModelo: AprendicesInterface) {
    this.aprendicesModelo = aprendicesModelo
  }
  async conseguirTodos(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const respuesta = await this.aprendicesModelo.conseguirTodos();
        res.json(respuesta);
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
        const respuesta = await this.aprendicesModelo.conseguirUno(id);
        res.json(respuesta);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorNoEncontrado) res.status(404).send(error.mensaje)
        if (error instanceof ErrorBaseDatos) res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async conseguirTodosPorInstructor(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const respuesta = await this.aprendicesModelo.conseguirTodosPorInstructor(id);
        res.json(respuesta);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorNoEncontrado) res.status(404).send(error.mensaje)
        if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async conseguirTodosPorFormacion(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const respuesta = await this.aprendicesModelo.conseguirTodosPorFormacion(id);
        res.json(respuesta);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorNoEncontrado) res.status(404).send(error.mensaje)
        if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async crear(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const respuesta = await this.aprendicesModelo.crear(req.body);
        res.json(respuesta);
      } catch (error: any) {
        console.log("Error: ", error.mensaje)
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
        const respuesta = await this.aprendicesModelo.actualizar(id, req.body.data);
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
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async eliminar(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const respuesta = await this.aprendicesModelo.eliminar(id);
        res.json(respuesta);
      } catch (error: any) {
        console.log("Error: ", error)
        res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async ingresar(req: Request, res: Response): Promise<void> {
    try {
      const { id, contraseña } = req.body;
      const respuesta = await this.aprendicesModelo.conseguirUno(id);
      generaTokenAcceso(res, { userTipo: "aprendiz", userData: respuesta }, respuesta, contraseña)
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
}