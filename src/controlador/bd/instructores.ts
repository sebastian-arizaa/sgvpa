import { Request, Response } from "express";
import { actualizarTokenAcceso, generaTokenAcceso } from "../../utils/jwt";
import { ErrorBaseDatos, ErrorConflicto, ErrorNoEncontrado } from "../../errores/mysql";
import { InstructoresInterface } from "../../types/modeloInterfaces";

interface InstructoresControladorInterface {
  instructoresModelo: InstructoresInterface;
  conseguirTodos(req: Request, res: Response): Promise<void>;
  conseguirUno(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
}

export class InstructoresControlador implements InstructoresControladorInterface {
  instructoresModelo: InstructoresInterface;
  constructor(instructoresModelo: InstructoresInterface) {
    this.instructoresModelo = instructoresModelo
  }

  async conseguirTodos(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo === "admin") {
      try {
        const respuesta = await this.instructoresModelo.conseguirTodos();
        res.json(respuesta);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async conseguirUno(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const respuesta = await this.instructoresModelo.conseguirUno(id);
        res.json(respuesta)
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
        const respuesta = await this.instructoresModelo.crear(req.body);
        res.json(respuesta);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorConflicto) res.status(409).send(error.mensaje)
        if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async actualizar(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        console.log(req.body)
        const respuesta = await this.instructoresModelo.actualizar(id, req.body.data);
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
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async eliminar(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const respuesta = await this.instructoresModelo.eliminar(id);
        res.json(respuesta);
      } catch (error: any) {
        console.log("Error: ", error)
        if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async ingresar(req: Request, res: Response): Promise<void> {
    try {
      const { id, contraseña } = req.body;
      const respuesta = await this.instructoresModelo.conseguirUno(id);
      generaTokenAcceso(res, { userTipo: "instructor", userData: respuesta }, respuesta, contraseña)
    } catch (error: any) {
      console.log("Error: ", error)
      if (error instanceof ErrorBaseDatos) res.status(500).send(error.mensaje)
      if (error instanceof ErrorNoEncontrado) res.status(404).send(error.mensaje)
    }
  }
}