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
  if(hashedContraseñaBd === hashedContraseña) {
    return true
  }else {
    return false
  }
}