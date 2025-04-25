import { MutableFile } from "megajs";
import { mega } from "../../server/conexion/megajs";

interface MegaStorageInterface {
  crearDirectorio(nombreDirectorio: string): Promise<MutableFile>;
  eliminarDirectorio(nombreDirectorio: string): Promise<boolean>;
  conseguirDirectorio(nombreDirectorio: string): Promise<MutableFile>;
  crearArchivo(nombreDirectorio: string, file: Express.Multer.File): Promise<boolean>;
  eliminarArchivo(nombreDirectorio: string, nombreArchivo: string): Promise<boolean>;
  conseguirArchivo(nombreDirectorio: string, nombreArchivo: string): Promise<MutableFile>;
}

class MegaStorage implements MegaStorageInterface {
  crearArchivo(nombreDirectorio: string, archivo: Express.Multer.File): Promise<boolean>  {
    return new Promise((resolve, reject) => {
      this.conseguirDirectorio(nombreDirectorio).then(directorio => {
        directorio.upload({ name: archivo.originalname }, archivo.buffer, (error, archivo) => {
          if (error) {
            console.error("Error uploading archivo:", error);
            reject(false);
          }
          console.log("archivo uploaded successfully:", archivo.name);
          resolve(true);
        });
      }).catch(error => {
        console.error("Error getting directory:", error);
        reject(false);
      })
    });
  }

  eliminarArchivo(nombreDirectorio: string, nombreArchivo: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.conseguirArchivo(nombreDirectorio, nombreArchivo).then(archivo => {
        archivo.delete(true, (error)=> {
          if(error) {
            console.error("Error deleting archivo:", error);
            reject(false);
            return
          }
          console.log("archivo deleted successfully:", nombreArchivo);
          resolve(true);
        })
      }).catch(error => {
        console.error("Error getting directory:", error);
        reject(false);
      })
    })
  }

  conseguirArchivo(nombreDirectorio: string, nombreArchivo: string): Promise<MutableFile> {
    return new Promise((resolve, reject) => {
      this.conseguirDirectorio(nombreDirectorio).then(directorio => {
        const archivo = directorio.find(nombreArchivo);
        if (!archivo) {
          console.error("File not found:", nombreArchivo);
          reject(false);
          return;
        }
        resolve(archivo);
      }).catch(error => {
        console.error("Error getting directory:", error);
        reject(false);
      })
    });
  }

  crearDirectorio(nombreDirectorio: string): Promise<MutableFile> {
    return new Promise((resolve, reject) => {
      mega.mkdir(nombreDirectorio, (error, directorio) => {
        if (error) {
          console.error("Error creating directory:", error);
          reject(false);
        }
        console.log("Directory created successfully:", nombreDirectorio);
        resolve(directorio);
      });
    });
  }

  conseguirDirectorio(nombreDirectorio: string): Promise<MutableFile> {
    return new Promise((resolve, reject) => {
      const directorio = mega.find(nombreDirectorio);
      if (!directorio) {
        this.crearDirectorio(nombreDirectorio)
          .then(respuesta => resolve(respuesta))
          .catch(err => reject(err))
        return;
      }
      resolve(directorio);
    });
  }

  eliminarDirectorio(nombreDirectorio: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.conseguirDirectorio(nombreDirectorio).then(directorio => {
        directorio.delete(true, (error) => {
          if (error) {
            console.error("Error deleting directory:", error);
            reject(false);
          }
          console.log("Directory deleted successfully:", nombreDirectorio);
          resolve(true);
        });
      }).catch(error => {
        console.error("Error getting directory:", error);
        reject(false);
      })
    })
  }
}

// app.get("/filee/:directory/:filename", async(req, res) => {
//   console.log("This is doing something?=aeaseasras")
//   const {directory, filename} = req.params
//   const folder = mega.find(directory)
//   const dataBuffer = await folder.find(filename).downloadBuffer()
//   // const pathh = path.join(__dirname, "/static", req.params.filename)

//   res.appendHeader("Content-Type", "application/pdf")
//   res.send(dataBuffer)
// })



export const megaStorage = new MegaStorage();