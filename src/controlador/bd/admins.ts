import { Request, Response } from "express";
import { admins } from "../../modelo/bdMysql/admins";
import { generaTokenAcceso } from "../../utils/jwt";

interface adminsControladorInterface {
  conseguirUno(req: Request, res: Response): void;
  ingresar(req: Request, res: Response): void;
}

class AdminsControlador implements adminsControladorInterface {
  async conseguirUno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await admins.conseguirUno(id)
      res.json(respuesta)
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
  async ingresar(req: Request, res: Response) {
    try {
      const { id, contraseña } = req.body;
      const respuesta = await admins.conseguirUno(id);
      generaTokenAcceso(res, { userTipo: "admin", userData: respuesta }, respuesta, contraseña)
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
}

export const adminsControlador = new AdminsControlador();
