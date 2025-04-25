interface FormacionesInterface {
  conseguirTodasFormaciones(): Promise<string>;
}

class Formaciones implements FormacionesInterface {
  async conseguirTodasFormaciones() {
    return "Hello! from admins model echeee!";
  }
}

export const formaciones = new Formaciones();