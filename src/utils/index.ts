import CryptoJS from 'crypto-js';

export const generarSalt = () => {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
};

export const hashContraseña = async (contraseña: string, salt: string) => {
  try {
    const hash = CryptoJS.SHA256(contraseña + salt);
    return hash.toString(CryptoJS.enc.Hex);
  } catch (error) {
    console.error("Error al hashear la contraseña con CryptoJS:", error);
    return null;
  }
};

export const compararHashContraseña = async (contraseña: string, salt: string, hashedContraseñaBd: string) => {
  const hashedContraseña = await hashContraseña(contraseña, salt)
  if (hashedContraseñaBd === hashedContraseña) {
    return true
  } else {
    return false
  }
}