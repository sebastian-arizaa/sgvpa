interface AdminsInterface {
  conseguirTodosAdmins(): Promise<string>;
}

class Admins implements AdminsInterface {
  async conseguirTodosAdmins() {
    return "Hello! from admins model echeee!";
  }
}

export const admins = new Admins();