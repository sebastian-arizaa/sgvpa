import { Request, Response } from "express";
import { aprendices } from "../modelo/bdMysql/aprendices";
import { AprendizType } from "../types";
import { compararHashContraseña } from "../utils";

interface AprendicesControladorInterface {
  conseguirTodos(req: Request, res: Response): void;
  conseguirUno(req: Request, res: Response): void;
  crear(req: Request, res: Response): void;
  actualizar(req: Request, res: Response): void;
  eliminar(req: Request, res: Response): void;
}

class AprendicesControlador implements AprendicesControladorInterface {
  async conseguirTodos(_req: Request, res: Response) {
    try {
      const resultado = await aprendices.conseguirTodos();
      res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async conseguirUno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await aprendices.conseguirUno(id);
      res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async crear(req: Request, res: Response) {
    try {
      const resultado = await aprendices.crear(req.body);
      res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await aprendices.actualizar(id, req.body);
      res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = await aprendices.eliminar(id);
      res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }

  async ingresar(req: Request, res: Response) {
    const { id, contraseña } = req.body;
    const respuesta = await aprendices.conseguirUno(id)
    if((respuesta as Array<AprendizType>).length) {
      const {hash_contraseña, salt} = (respuesta as Array<AprendizType>)[0]
      const respuestaHashContraseña = await compararHashContraseña(contraseña, salt, hash_contraseña)
      if(respuestaHashContraseña) {
        res.send("Acceso Permitido!!");
      }else {
        res.status(401).send("Acceso no permitido, contraseña incorrecta");
      }

    }else {
      res.status(404).send("Usario inexistente");
    }
  } 
}

export const aprendicesControlador = new AprendicesControlador();
