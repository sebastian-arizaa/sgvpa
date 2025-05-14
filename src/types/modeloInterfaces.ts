import { QueryResult } from "mysql2"
import { ActaType, AdminType, AprendicesFormacionesType, AprendizType, FormacionType, InnerAprendizFormacionType, InnerAprendizInstructorFormacionType, InstructoresAprendicesType, InstructorType } from "."

export interface ActasInterface {
  conseguirTodasPorAprendiz(id: string): Promise<ActaType[]>
  agregarTodasPorAprendiz(aprendizId: string, formacionId: string, actaId: string[], nombre_directorio: string): Promise<QueryResult>
  actulizarUna(id: string, actaData: ActaType): Promise<QueryResult>
}

export interface AdminsInterface {
  conseguirUno(id: string): Promise<AdminType>
}

export interface AprendicesFormacionesInterface {
  conseguirTodos(): Promise<AprendicesFormacionesType[]>;
  conseguirUno(id: number): Promise<AprendicesFormacionesType>;
  crear(data: AprendicesFormacionesType): Promise<QueryResult>;
  actualizar(id: number, data: AprendicesFormacionesType): Promise<QueryResult>;
  eliminar(id: number): Promise<QueryResult>;
}

export interface AprendicesInterface {
  conseguirTodos(): Promise<AprendizType[]>;
  conseguirUno(id: string): Promise<AprendizType>;
  conseguirTodosPorInstructor(id: string): Promise<InnerAprendizInstructorFormacionType[]>
  conseguirTodosPorFormacion(id: string): Promise<InnerAprendizFormacionType[]>
  crear(data: AprendizType): Promise<QueryResult>;
  actualizar(id: string, data: AprendizType): Promise<QueryResult>;
  eliminar(id: string): Promise<QueryResult>;
}

export interface FormacionesInterface {
  conseguirTodos(): Promise<FormacionType[]>;
  conseguirUno(id: string): Promise<FormacionType>;
  crear(data: FormacionType): Promise<QueryResult>;
  actualizar(id: string, data: FormacionType): Promise<QueryResult>;
  eliminar(id: string): Promise<QueryResult>;
}

export interface InstructoresAprendicesInterface {
  conseguirTodos(): Promise<InstructoresAprendicesType[]>;
  conseguirUno(id: number): Promise<InstructoresAprendicesType>;
  crear(data: InstructoresAprendicesType): Promise<QueryResult>;
  actualizar(id: number, data: InstructoresAprendicesType): Promise<QueryResult>;
  eliminar(id: number): Promise<QueryResult>;
}

export interface InstructoresInterface {
  conseguirTodos(): Promise<InstructorType[]>;
  conseguirUno(id: string): Promise<InstructorType>;
  crear(data: InstructorType): Promise<QueryResult>;
  actualizar(id: string, data: InstructorType): Promise<QueryResult>;
  eliminar(id: string): Promise<QueryResult>;
}
