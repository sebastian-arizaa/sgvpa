
// Interface de tablas

/* interface Usurio {
  id: string,
  nombre: string,
  apellidos: string,
  telefono: string,
  email: string,
  contraseña: string
} */

export type AdminType = {
  id: string,
  hash_contraseña: string,
  salt: string
}

export type InstructorType = {
  id: string,
  nombre: string,
  apellidos: string,
  telefono: string,
  email: string,
  hash_contraseña: string,
  salt: string
}

export type AprendizType = InstructorType & {
  formacion_actual_id: string
}

export type FormacionesType = {
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

// export type AprendizFormacionType {}
// export type AprendizInstructorFormacionType {}


export type JwtPayloadType = {
  userTipo: 'admin' | 'instructor' | 'aprendiz' | null | undefined,
  userData: { id: string } | AprendizType | InstructorType | null | undefined
}