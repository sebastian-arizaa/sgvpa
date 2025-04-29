import { Request, Response } from "express";
import { admins } from "../../modelo/bdMysql/admins";
import { AdminType } from "../../types";
import { compararHashContraseña } from "../../utils";

interface adminsControladorInterface {
  ingresar(req: Request, res: Response): void;
}

class AdminsControlador implements adminsControladorInterface {
  async ingresar(req: Request, res: Response) {
    const { id, contraseña } = req.body;
    const respuesta = await admins.conseguirUno(id)
    if((respuesta as Array<AdminType>).length) {
      const {hash_contraseña, salt} = (respuesta as Array<AdminType>)[0]
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

export const adminsControlador = new AdminsControlador();
