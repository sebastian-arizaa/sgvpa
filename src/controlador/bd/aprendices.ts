import { Request, Response } from "express";
import { aprendices } from "../../modelo/bdMysql/aprendices";
import { AprendizType } from "../../types";
import { generaTokenAcceso } from "../../utils";

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
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async conseguirUno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.conseguirUno(id);
      if ((respuesta as Array<AprendizType>).length) {
        res.json(respuesta)
      } else {
        res.status(404).send("Usuario no encontrado");
      }
      res.json(respuesta);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async conseguirTodosPorInstructor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.conseguirTodosPorInstructor(id);
      res.json(respuesta);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async conseguirTodosPorFormacion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.conseguirTodosPorFormacion(id);
      res.json(respuesta);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async crear(req: Request, res: Response) {
    try {
      const respuesta = await aprendices.crear(req.body);
      res.json(respuesta);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.actualizar(id, req.body);
      res.json(respuesta);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await aprendices.eliminar(id);
      res.json(respuesta);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async ingresar(req: Request, res: Response) {
    const { id, contraseña } = req.body;
    const respuesta = await (aprendices.conseguirUno(id) as Promise<AprendizType[]>)
    if (respuesta.length) {
      generaTokenAcceso(res, { userTipo: "aprendiz", userData: respuesta[0] }, respuesta, contraseña)
    } else {
      res.status(404).send("Usario inexistente");
    }
  }
}

export const aprendicesControlador = new AprendicesControlador();
