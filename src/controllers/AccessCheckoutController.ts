import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { PlanilleroService } from "../services/PlanilleroService";
import { SECRET_KEY } from "../middlewares/jwtMiddleware";
import logger from "../config/logger";
import jwt from "jsonwebtoken";


export class AccessCheckoutController {
    constructor(private planilleroService: PlanilleroService) { }

    loginAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { cedulaPlanillero, password, selectedCityType } = req.body;

            const result = await this.planilleroService.loginAccount(
                Number(cedulaPlanillero),
                password,
                Number(selectedCityType)
            );

            const token = jwt.sign(
                {
                    cedulaPlanillero: result.cedulaPlanillero,
                    nombreCompleto: result.nombreCompleto,
                    isAdmin: result.isAdmin,
                    type: selectedCityType
                },
                SECRET_KEY || '',
                {
                    expiresIn: '1h',
                },
            );

            logger.info('El token generado exitosamente');

            return res.status(200).json({
                success: true,
                data: {
                    result,
                    token,
                },
                message: "Inicio de sesión exitoso"
            });

        } catch (error) {
            next(error);
        }
    };

    registerPlanillero = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (process.env.NODE_ENV === 'production') {
                return res.status(403).json({
                    success: false,
                    message: 'Registro deshabilitado en producción',
                });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { cedulaPlanillero, nombreCompleto, password, selectedCityType } = req.body;

            await this.planilleroService.registerPlanillero({
                cedulaPlanillero: Number(cedulaPlanillero),
                nombreCompleto,
                password,
                selectedCityType: Number(selectedCityType)
            });

            return res.status(201).json({
                success: true,
                message: "Planillero creado correctamente"
            });

        } catch (error) {
            next(error);
        }
    };


}