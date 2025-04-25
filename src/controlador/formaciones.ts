import { Request, Response } from "express";
import { formaciones } from "../modelo/bdMysql/formaciones";

interface FormacionesControladorInterface {
  conseguirTodasFormaciones(req: Request, res: Response): void; // Static method signature
}

class FormacionesControlador implements FormacionesControladorInterface {
  async conseguirTodasFormaciones(_req: Request, res: Response) {
    const data = await formaciones.conseguirTodasFormaciones();
    res.json({data});
  }
}

export const formacionesControlador = new FormacionesControlador();
