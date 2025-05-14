import { Request, Response } from "express";
import { generaTokenAcceso } from "../../utils/jwt";
import { AdminsInterface } from "../../types/modeloInterfaces";

interface adminsControladorInterface {
  adminsModelo: AdminsInterface
  conseguirUno(req: Request, res: Response): Promise<void>;
  ingresar(req: Request, res: Response): Promise<void>;
}

export class AdminsControlador implements adminsControladorInterface {
  adminsModelo: AdminsInterface;
  constructor(adminsModelo: AdminsInterface) {
    this.adminsModelo = adminsModelo
  }

  async conseguirUno(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const respuesta = await this.adminsModelo.conseguirUno(id)
        res.json(respuesta)
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
      const respuesta = await this.adminsModelo.conseguirUno(id);
      generaTokenAcceso(res, { userTipo: "admin", userData: respuesta }, respuesta, contraseña)
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
}