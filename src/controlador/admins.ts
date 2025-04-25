import { Request, Response } from "express";
import { admins } from "../modelo/bdMysql/admins";

interface adminsControladorInterface {
  conseguirTodosAdmins(req: Request, res: Response): void;
}

class AdminsControlador implements adminsControladorInterface {
  async conseguirTodosAdmins(_req: Request, res: Response) {
    const data = await admins.conseguirTodosAdmins();
    res.json(data);
  }
}

export const adminsControlador = new AdminsControlador();
