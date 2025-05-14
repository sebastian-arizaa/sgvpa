import 'dotenv/config'

const BD_TYPE = (process.env.DB_TYPE as "mysql" | "postgres") || "mysql";
console.log(process.env.DB_USER )

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
  BD_TYPE: "mysql" | "postgres"
} = {
  NODE_ENV: process.env.NODE_ENV || "production",
  SECRET_WORD: process.env.SECRET_WORD || "palabra_secreta",
  PORT: process.env.PORT || 3000,
  BD_TYPE: BD_TYPE,
  DB_HOST: process.env.DB_HOST || (BD_TYPE === "mysql" ? "localhost" : "localhost"),
  DB_NAME: process.env.DB_NAME || (BD_TYPE === "mysql" ? "test" : "test"),
  DB_USER: process.env.DB_USER || (BD_TYPE === "mysql" ? "root" : "postgres"),
  DB_PASSWORD: process.env.DB_PASSWORD || (BD_TYPE === "mysql" ? "123" : "123"),
  DB_PORT: process.env.DB_PORT || (BD_TYPE === "mysql" ? 3306 : 5432),
  MEGAJS_EMAIL: process.env.MEGAJS_EMAIL || "",
  MEGAJS_PASSWORD: process.env.MEGAJS_PASSWORD || "",
};

export { dotenvConfig }