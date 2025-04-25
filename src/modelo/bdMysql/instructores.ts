interface InstructoresInterface {
  conseguirTodosIntructores(): Promise<string>;
}

class Instructores implements InstructoresInterface {
  async conseguirTodosIntructores() {
    return "Hello! from admins model echeee!";
  }
}

export const instructores = new Instructores();