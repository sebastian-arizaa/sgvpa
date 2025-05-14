import { Request, Response } from "express";
import { AprendicesFormacionesInterface } from "../../types/modeloInterfaces";

interface AprendicesFormacionesControladorInterface {
  aprendicesFormacionesModelo: AprendicesFormacionesInterface;
  conseguirTodos(req: Request, res: Response): Promise<void>;
  conseguirUno(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
}

export class AprendicesFormacionesControlador implements AprendicesFormacionesControladorInterface {
  aprendicesFormacionesModelo: AprendicesFormacionesInterface;
  constructor(aprendicesFormacionesModelo: AprendicesFormacionesInterface) {
    this.aprendicesFormacionesModelo = aprendicesFormacionesModelo
  }
  async conseguirTodos(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const resultado = await this.aprendicesFormacionesModelo.conseguirTodos();
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
        const resultado = await this.aprendicesFormacionesModelo.conseguirUno(Number(id));
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
        const resultado = await this.aprendicesFormacionesModelo.crear(req.body);
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
        const resultado = await this.aprendicesFormacionesModelo.actualizar(Number(id), req.body);
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
        const resultado = await this.aprendicesFormacionesModelo.eliminar(Number(id));
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