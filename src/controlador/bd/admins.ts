import { Request, Response } from "express";
import { admins } from "../../modelo/bdMysql/admins";
import { AdminType } from "../../types";
import { generaTokenAcceso } from "../../utils";

interface adminsControladorInterface {
  conseguirUno(req: Request, res: Response): void;
  ingresar(req: Request, res: Response): void;
}

class AdminsControlador implements adminsControladorInterface {
  async conseguirUno(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const respuesta = await admins.conseguirUno(id)
      if ((respuesta as Array<AdminType>).length) {
        res.json(respuesta)
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    } catch (error) {
      res.status(500).end()
    }
  }
  async ingresar(req: Request, res: Response) {
    const { id, contraseña } = req.body;
    const respuesta = await (admins.conseguirUno(id) as Promise<AdminType[]>)
    if (respuesta.length) {
      generaTokenAcceso(res, { userTipo: "admin", userData: { id: respuesta[0].id } }, respuesta, contraseña)
    } else {
      res.status(404).send("Usario inexistente");
    }
  }
}

export const adminsControlador = new AdminsControlador();
