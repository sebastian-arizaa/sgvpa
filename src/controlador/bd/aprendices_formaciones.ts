import { Request, Response } from "express";
import { aprendicesFormaciones } from "../../modelo/bdMysql/aprendices_formaciones";

interface AprendicesFormacionesControladorInterface {
  conseguirTodos(req: Request, res: Response): Promise<void>;
  conseguirUno(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
}

class AprendicesFormacionesControlador implements AprendicesFormacionesControladorInterface {
  async conseguirTodos(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const resultado = await aprendicesFormaciones.conseguirTodos();
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
        const resultado = await aprendicesFormaciones.conseguirUno(Number(id));
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async crear(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const resultado = await aprendicesFormaciones.crear(req.body);
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async actualizar(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const resultado = await aprendicesFormaciones.actualizar(Number(id), req.body);
        res.json(resultado);
      } catch (error: any) {
        console.log("Error: ", error)
        res.status(500).end()
      }
    } else {
      res.status(403).send("Acceso denegado!")
    }
  }
  async eliminar(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const resultado = await aprendicesFormaciones.eliminar(Number(id));
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

export const aprendicesFormacionesControlador = new AprendicesFormacionesControlador();