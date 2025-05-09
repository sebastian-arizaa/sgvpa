import { webcrypto as nodeCrypto } from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = nodeCrypto;
}

import { Storage } from "megajs"
import { dotenvConfig } from "../../dotenv";

export const mega = new Storage({
  email: dotenvConfig.MEGAJS_EMAIL,
  password: dotenvConfig.MEGAJS_PASSWORD,
  autologin: true
});