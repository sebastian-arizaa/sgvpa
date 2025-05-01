import jwt from "jsonwebtoken";
import { dotenvConfig } from "../server/dotenv";
import { JwtPayloadType, UserTypes } from "../types";
import { Response } from "express";

export const generarSalt = () => {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  return Array.from(saltBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const hashContraseña = async (contraseña: string, salt: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(contraseña + salt);

  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedContraseña = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return hashedContraseña;
  } catch (error) {
    console.error("Error al hashear la contraseña:", error);
    return null;
  }
}

export const compararHashContraseña = async (contraseña: string, salt: string, hashedContraseñaBd: string) => {
  const hashedContraseña = await hashContraseña(contraseña, salt)
  if (hashedContraseñaBd === hashedContraseña) {
    return true
  } else {
    return false
  }
}

export const generaTokenAcceso = async (res: Response, payload: JwtPayloadType, respuesta: UserTypes[], contraseña: string) => {
  const { hash_contraseña, salt } = respuesta[0]
  const respuestaHashContraseña = await compararHashContraseña(contraseña, salt, hash_contraseña)
  if (respuestaHashContraseña) {
    const token = jwt.sign(payload, dotenvConfig.SECRET_WORD, { expiresIn: "1h", })
    res.cookie("token_acceso", token, {
      secure: dotenvConfig.NODE_ENV == "production",
      httpOnly: true,
      sameSite: dotenvConfig.NODE_ENV == "production" ? "strict" : "lax",
      maxAge: 60 * 60 * 1000,
    }).json({ ...payload })
  } else {
    res.status(401).send("Acceso no permitido, contraseña incorrecta");
  }
}