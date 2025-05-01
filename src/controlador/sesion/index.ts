import { Request, Response } from "express"

interface SesionControladorInterface {
  ingresar(req: Request, res: Response): void,
  salir(req: Request, res: Response): void,
}

class SesionControlador implements SesionControladorInterface {
  ingresar(req: Request, res: Response) {
    if (req.sesion) {
      if (req.sesion.userTipo) {
        res.json(req.sesion)
      } else {
        res.status(401).send("No autorizado")
      }
    }
  }

  salir(_req: Request, res: Response) {
    res.clearCookie("token_acceso").send("Sesión cerrada")
  }
}

export const sesionControlador = new SesionControlador()