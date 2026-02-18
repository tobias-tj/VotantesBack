import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { PlanilleroService } from "../services/PlanilleroService";


export class AccessCheckoutController{
    constructor(private planilleroService: PlanilleroService) {}

    loginAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { cedulaPlanillero, password } = req.body;

        const result = await this.planilleroService.loginAccount(
            Number(cedulaPlanillero),
            password
        );

        return res.status(200).json({
            success: true,
            data: result
        });

        } catch (error) {
            next(error);
        }
    };

    registerPlanillero = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cedulaPlanillero, nombreCompleto, password } = req.body;

        await this.planilleroService.registerPlanillero({
            cedulaPlanillero: Number(cedulaPlanillero),
            nombreCompleto,
            password
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