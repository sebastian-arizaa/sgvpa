import { Request, Response } from "express";
import { instructores } from "../modelo/bdMysql/instructores";

interface InstructoresControladorInterface {
  conseguirTodosInstructores(req: Request, res: Response): void; // Static method signature
}

class InstructoresControlador implements InstructoresControladorInterface {
  async conseguirTodosInstructores(_req: Request, res: Response) {
    const data = await instructores.conseguirTodosIntructores();
    res.json({data});
  }
}

export const instructoresControlador = new InstructoresControlador();
