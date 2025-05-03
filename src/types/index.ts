
// Interface de tablas

/* interface Usurio {
  id: string,
  nombre: string,
  apellidos: string,
  telefono: string,
  email: string,
  contraseña: string
} */

// export interface MysqlQueryRespuesta extends ResultSetHeader {
//   data: AdminType[] | InstructorType[] | AprendizType[] | FormacionesType[]
// }

export type AdminType = {
  id: string,
  hash_contraseña: string,
  salt: string
}

export type InstructorType = {
  id: string,
  nombre: string,
  apellidos: string,
  telefono: string | null,
  email: string | null,
  hash_contraseña: string,
  salt: string
}

export type AprendizType = InstructorType & {
  formacion_actual_id: string
}

export type FormacionType = {
  id: string,
  nombre: string,
  nombre_municipio: string,
  nombre_departamento: string,
}

export type InstructoresAprendicesType = {
  id: number,
  instructor_id: string,
  aprendiz_id: string,
  activa: boolean,
}

export type AprendicesFormacionesType = {
  id: number,
  formacion_id: string,
  aprendiz_id: string,
  activa: boolean,
}

export type UserTypes = AdminType | InstructorType | AprendizType

export type InnerAprendizFormacionType = AprendizType & FormacionType & {
  activa: boolean
}

export type InnerAprendizInstructorFormacionType = InnerAprendizFormacionType


export type JwtPayloadType = {
  userTipo: 'admin' | 'instructor' | 'aprendiz' | null | undefined,
  userData: { id: string } | AprendizType | InstructorType | null | undefined
}

export type ButtonVariante = 'primario' | 'secundario' | 'terciario' | 'peligro';