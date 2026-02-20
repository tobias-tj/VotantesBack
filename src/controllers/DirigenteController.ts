import { NextFunction, Request, Response } from "express";
import { DirigenteService } from "../services/DirigenteService";
import { decodeToken } from "../middlewares/jwtMiddleware";
import { validationResult } from "express-validator";

export class DirigenteController {
  constructor(private dirigenteService: DirigenteService) {}

  getAllDirigentes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authHeader = req.headers.authorization;
      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) return res.status(401).json({ message: "Token requerido" });

      const decoded = decodeToken(token);

      if (!decoded?.cedulaPlanillero || !decoded?.nombreCompleto) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      const dirigentes = await this.dirigenteService.getAllDirigentes();

      res.json({
        status: 'success',
        data: dirigentes,
        message: 'Dirigentes obtenidos correctamente'
      });

    } catch (error) {
      next(error);
    }
  };
  
  getEstadisticas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authHeader = req.headers.authorization;
      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) return res.status(401).json({ message: "Token requerido" });

      const decoded = decodeToken(token);

      if (!decoded?.cedulaPlanillero || !decoded?.nombreCompleto || decoded?.isAdmin === undefined) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      if (!decoded.isAdmin) {
        return res
          .status(403)
          .json({ error: 'No tienes permisos para realizar esta accion' });
      }

      const estadisticas = await this.dirigenteService.getEstadisticas();

      res.json({
        status: 'success',
        data: estadisticas,
        message: 'Estadisticas obtenidas correctamente'
      });

    } catch (error) {
      next(error);
    }
  };
}
