import jwt from "jsonwebtoken";
import { dotenvConfig } from "../server/dotenv";
import { JwtPayloadType, UserTypes } from "../types";
import { Response } from "express";
import { compararHashContraseña } from ".";

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