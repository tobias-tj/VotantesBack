import { validationResult } from "express-validator";
import { PlanillaService } from "../services/PlanillaService";
import { NextFunction, Request, Response } from "express";
import { CreatePlanillaDTO } from "../models/Planilla";
import logger from "../config/logger";

export class PlanillaController {
    constructor(private planillaService: PlanillaService) {}

    createPlanilla = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { cedulaDirigente, nombreDirigente, cedulaPlanillero, cedulasVotantes } = req.body;

            console.log("cedulasVotantes", cedulasVotantes);

            const cedulasArray =
                Array.isArray(cedulasVotantes)
                    ? cedulasVotantes
                    : cedulasVotantes.split(',').map((c: string) => Number(c.trim()));
            
            console.log("cedulasArray", cedulasArray);

            const planilla: CreatePlanillaDTO = {
                cedulaDirigente: Number(cedulaDirigente),
                nombreDirigente,
                cedulaPlanillero: Number(cedulaPlanillero),
                cedulasVotantes: cedulasArray,
            };

            const planillaId = await this.planillaService.createPlanilla(planilla);       
            
            return res.status(201).json({
                success: true,
                data: { id: planillaId }
            });
        } catch (error) {
            next(error);
        }
    };
}