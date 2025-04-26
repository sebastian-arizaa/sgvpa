import { MutableFile } from "megajs";
import { mega } from "../../server/conexion/megajs";

interface MegaStorageInterface {
  crearArchivo(nombreDirectorio: string, file: Express.Multer.File): Promise<boolean>;
  eliminarArchivo(nombreDirectorio: string, nombreArchivo: string): Promise<boolean>;
  conseguirArchivo(nombreDirectorio: string, nombreArchivo: string): Promise<MutableFile>;
  crearDirectorio(nombreDirectorio: string): Promise<MutableFile>;
  eliminarDirectorio(nombreDirectorio: string): Promise<boolean>;
  conseguirDirectorio(nombreDirectorio: string): Promise<MutableFile>;
}

class MegaStorage implements MegaStorageInterface {
  crearArchivo(nombreDirectorio: string, archivo: Express.Multer.File): Promise<boolean>  {
    return new Promise((resolve, reject) => {
      this.conseguirDirectorio(nombreDirectorio).then(directorio => {
        directorio.upload({ name: archivo.originalname }, archivo.buffer, (error, archivo) => {
          if (error) {
            console.error("Error al subir el archivo:", error);
            reject(false);
          }
          console.log("archivo subido correctamente:", archivo.name);
          resolve(true);
        });
      }).catch(error => {
        console.error("Error al conseguir directorio:", error);
        reject(false);
      })
    });
  }

  eliminarArchivo(nombreDirectorio: string, nombreArchivo: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.conseguirArchivo(nombreDirectorio, nombreArchivo).then(archivo => {
        archivo.delete(true, (error)=> {
          if(error) {
            console.error("Error al eliminar archivo:", error);
            reject(false);
            return
          }
          console.log("archivo eliminado correctamente:", nombreArchivo);
          resolve(true);
        })
      }).catch(error => {
        console.error("Error al conseguir archivo:", error);
        reject(false);
      })
    })
  }

  conseguirArchivo(nombreDirectorio: string, nombreArchivo: string): Promise<MutableFile> {
    return new Promise((resolve, reject) => {
      this.conseguirDirectorio(nombreDirectorio).then(directorio => {
        const archivo = directorio.find(nombreArchivo);
        if (!archivo) {
          console.error("Archivo no encontrado:", nombreArchivo);
          reject(false);
          return;
        }
        resolve(archivo);
      }).catch(error => {
        console.error("Erorr al conseguir directorio:", error);
        reject(false);
      })
    });
  }

  crearDirectorio(nombreDirectorio: string): Promise<MutableFile> {
    return new Promise((resolve, reject) => {
      mega.mkdir(nombreDirectorio, (error, directorio) => {
        if (error) {
          console.error("Error al crear directorio:", error);
          reject(false);
        }
        console.log("Directory creado correctamente:", nombreDirectorio);
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
            console.error("Error al eliminar directorio:", error);
            reject(false);
          }
          console.log("Directorio eliminado correctamente:", nombreDirectorio);
          resolve(true);
        });
      }).catch(error => {
        console.error("Error al conseguir directorio:", error);
        reject(false);
      })
    })
  }
}

export const megaStorage = new MegaStorage();