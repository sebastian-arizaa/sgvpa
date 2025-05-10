import { Request, Response } from "express";
import { admins } from "../../modelo/bdMysql/admins";
import { generaTokenAcceso } from "../../utils/jwt";

interface adminsControladorInterface {
  conseguirUno(req: Request, res: Response): Promise<void>;
  ingresar(req: Request, res: Response): Promise<void>;
}

class AdminsControlador implements adminsControladorInterface {
  async conseguirUno(req: Request, res: Response): Promise<void> {
    if (req.sesion?.userTipo) {
      try {
        const { id } = req.params;
        const respuesta = await admins.conseguirUno(id)
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
      const respuesta = await admins.conseguirUno(id);
      generaTokenAcceso(res, { userTipo: "admin", userData: respuesta }, respuesta, contraseña)
    } catch (error: any) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
}

export const adminsControlador = new AdminsControlador();
