import 'dotenv/config'

const BD_TYPE = process.env.DB_TYPE || "mysql";

let dotenvConfig: {
  NODE_ENV: string;
  SECRET_WORD: string;
  PORT: number | string;
  DB_HOST: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number | string;
  MEGAJS_EMAIL: string;
  MEGAJS_PASSWORD: string;
} = {
  NODE_ENV: process.env.NODE_ENV || "production",
  SECRET_WORD: process.env.SECRET_WORD || "palabra_secreta",
  PORT: "",
  DB_HOST: "",
  DB_NAME: "",
  DB_USER: "",
  DB_PASSWORD: "",
  DB_PORT: "",
  MEGAJS_EMAIL: process.env.MEGAJS_EMAIL || "",
  MEGAJS_PASSWORD: process.env.MEGAJS_PASSWORD || "",
};

if (BD_TYPE == "mysql") {
  dotenvConfig = {
    ...dotenvConfig,
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_NAME: process.env.DB_NAME || "test",
    DB_USER: process.env.DB_USER || "root ",
    DB_PASSWORD: process.env.DB_PASSWORD || "123",
    DB_PORT: process.env.DB_PORT || 3306,
  }
} else if (BD_TYPE == "postgres") {
  dotenvConfig = {
    ...dotenvConfig,
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_NAME: process.env.DB_NAME || "test",
    DB_USER: process.env.DB_USER || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD || "123",
    DB_PORT: process.env.DB_PORT || 5432,
  }
}

export { dotenvConfig }