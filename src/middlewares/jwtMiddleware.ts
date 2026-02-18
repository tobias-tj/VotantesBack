import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  cedulaPlanillero: number;
  nombreCompleto: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

dotenv.config();
const key = process.env.JWT_PRIVATE_KEY;

export const SECRET_KEY = key;

if (!SECRET_KEY) {
  throw new Error(
    'Falta la clave secreta JWT (JWT_PRIVATE_KEY) en las variables de entorno.',
  );
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY!) as any;
    // Extraer los datos que necesitas
    return {
      cedulaPlanillero: decoded.cedulaPlanillero,
      nombreCompleto: decoded.nombreCompleto,
      isAdmin: decoded.isAdmin,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};
