import { actas as actasMysql } from "../modelo/bdMysql/actas";
import { actas as actasPostgres } from "../modelo/bdPostgres/actas";
import { admins  as adminsMysql} from "../modelo/bdMysql/admins";
import { admins as adminsPostgres} from "../modelo/bdPostgres/admins";
import { aprendicesFormaciones as aprendicesFormacionesMysql } from "../modelo/bdMysql/aprendices_formaciones";
import { aprendicesFormaciones as  aprendicesFormacionesPostgres} from "../modelo/bdPostgres/aprendices_formaciones";
import { aprendices as aprendicesMysql } from "../modelo/bdMysql/aprendices";
import { aprendices as aprendicesPostgres } from "../modelo/bdPostgres/aprendices";
import { formaciones  as formacionesMysql} from "../modelo/bdMysql/formaciones";
import { formaciones as formacionesPostgres } from "../modelo/bdPostgres/formaciones";
import { instructoresAprendices as  instructoresAprendicesMysql} from "../modelo/bdMysql/instructores_aprendices";
import { instructoresAprendices as instructoresAprendicesPostgres } from "../modelo/bdPostgres/instructores_aprendices";
import { instructores as  instructoresMysql} from "../modelo/bdMysql/instructores";
import { instructores as instructoresPostgres } from "../modelo/bdPostgres/instructores";

export const modelos = {
  "mysql": {
    actas: actasMysql,
    admins: adminsMysql,
    aprendices_formaciones: aprendicesFormacionesMysql,
    aprendices: aprendicesMysql,
    formaciones: formacionesMysql,
    instructores_aprendices: instructoresAprendicesMysql,
    instructores: instructoresMysql
  },
  "postgres": {
    actas: actasPostgres,
    admins: adminsPostgres,
    aprendices_formaciones: aprendicesFormacionesPostgres,
    aprendices: aprendicesPostgres,
    formaciones: formacionesPostgres,
    instructores_aprendices: instructoresAprendicesPostgres,
    instructores: instructoresPostgres
  }
}