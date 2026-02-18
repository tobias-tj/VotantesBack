import { NextFunction, Request, Response } from "express";
import { decodeToken } from "./jwtMiddleware";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = decodeToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Token inválido" });
  }

  if (!decoded.isAdmin) {
    return res.status(403).json({ message: "Acceso solo para administradores" });
  }

//   req.user = decoded;
  next();
};
