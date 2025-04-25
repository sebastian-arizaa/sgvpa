import { Storage } from "megajs"
import { dotenvConfig } from "../../dotenv";

export const mega = new Storage({
  email: dotenvConfig.MEGAJS_EMAIL,
  password: dotenvConfig.MEGAJS_PASSWORD,
  autologin: true
});