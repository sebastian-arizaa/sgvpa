import { Request, Response } from "express";
import { megaStorage } from "../../storage/megajs";
import { Readable } from "node:stream";
import { Nullable } from "megajs";

interface MegaJsControladorInterface {
  conseguirUno(req: Request, res: Response): void,
  conseguirTodosNombres(req: Request, res: Response): void,
  crear(req: Request, res: Response): void,
  eliminar(req: Request, res: Response): void
}

class MegaJsControlador implements MegaJsControladorInterface {
   async conseguirUno(req: Request, res: Response) {
    try {
      const { nombreDirectorio, nombreArchivo} = req.body
      const archvio = await megaStorage.conseguirArchivo(nombreDirectorio, nombreArchivo)
      if(archvio) {
        (archvio.download({}) as Readable).pipe(res)
      }else {
        res.status(404).send("Archivo no encontrado")
      }
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }

   async conseguirTodosNombres(req: Request, res: Response) {
      try {
      const { nombreDirectorio } = req.params
      const directorio = await megaStorage.conseguirDirectorio(nombreDirectorio)
      if(directorio) {
        const nombreArchivos: Nullable<string>[] = []
        directorio.children?.forEach((archivo)=> {
          nombreArchivos.push(archivo.name)
        })
        res.json({data: nombreArchivos})
      }else {
        res.status(404).send("Directorio no encontrado")
      }
      // res.json(resultado);
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }

   async crear(req: Request, res: Response) {
      try {
      const { nombreDirectorio } = req.params
      if(req.file) {
        const respuesta = await megaStorage.crearArchivo(nombreDirectorio, req.file)
        if(respuesta) {
          res.send("Archivo guardado exitosamente!")
        }else {
          res.status(500).send("Hubo un error")
        }
      }else {
        res.status(400).send("bad request")
      }
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }

  async eliminar(req: Request, res: Response) {
    try {
      const { nombreDirectorio, nombreArchivo } = req.body
      const respuesta = await megaStorage.eliminarArchivo( nombreDirectorio, nombreArchivo )
      if(respuesta) {
        res.send("Archivo eliminado exitosamente!")
      }else {
        res.status(404).send("Archivo no encontrado")
      }
    } catch (error) {
      console.log("Error: ", error)
      res.status(500).end()
    }
  }
}

export const megaJsControlador = new MegaJsControlador