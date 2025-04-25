import { Request, Response } from "express";
import { megaStorage } from "../storage/megajs";
import { Readable } from "stream";

interface AprendicesControladorInterface {
  conseguirTodosAprendices(req: Request, res: Response): void;
}

class AprendicesControlador implements AprendicesControladorInterface {
  async conseguirTodosAprendices(req: Request, res: Response) {
    console.log("LLEGO AQUII")
    console.log("data", req.file?.originalname)

    if(req.file) {
      // const response = await megaStorage.uploadFile(req.file)
      // const response = await megaStorage.eliminarDirectorio("AAAAAAAA")
      // const response = await megaStorage.crearArchivo("AAAAAAAA", req.file)
      // const response = await megaStorage.eliminarArchivo("AAAAAAAA", req.file.originalname)
      const response = await megaStorage.conseguirArchivo("AAAAAAAA", req.file.originalname)
      
      // const filee = response.download({})
      // console.log("🚀 ~ AprendicesControlador ~ conseguirTodosAprendices ~ filee:", filee)

      // const response = await megaStorage.conseguirDirectorio("AAAAAAAA")
      // console.log("🚀 ~ AprendicesControlador ~ conseguirTodosAprendices ~ response:", response)

      // const children = response.children
      // console.log("🚀 ~ AprendicesControlador ~ conseguirTodosAprendices ~ children:", children)

      // const promesas: Promise<Buffer | string>[] = []
      // children?.forEach((archivo) => {
      //   console.log("File nameeee ======> ", archivo.name)
      //   // console.log("File link ======> ", archivo.name)
      //   promesas.push(archivo.downloadBuffer({}))
      //   // archivo.download()
      //   promesas.push(archivo.link(false))
      // })

      // Promise.all(promesas).then((buffers) => {
      //   console.log("🚀 ~ AprendicesControlador ~ conseguirTodosAprendices ~ buffers:", buffers)
      // })

      if(response) {
        // res.send()

        res.setHeader('Content-Disposition', `attachment; filename="${response.name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        (response.download({}) as Readable).pipe(res)
        
        // res.json({ok: true})
      }else {
        res.send("Error al crear el directorio")
      }
    }
  }
}

export const aprendicesControlador = new AprendicesControlador();
