import { validationResult } from "express-validator";
import { PlanillaService } from "../services/PlanillaService";
import { NextFunction, Request, Response } from "express";
import { CreatePlanillaDTO, GetPlanillaDTO } from "../models/Planilla";
import logger from "../config/logger";
import { decodeToken } from "../middlewares/jwtMiddleware";

export class PlanillaController {
    constructor(private planillaService: PlanillaService) {}

    createPlanilla = async (req: Request, res: Response, next: NextFunction) => {
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

            if (!token) return res.status(401);

            const decoded = decodeToken(token);

            if (!decoded?.cedulaPlanillero || !decoded?.nombreCompleto) {
                return res
                    .status(401)
                    .json({ error: 'Error autenticando Token, faltan datos' });
            }


            const { cedulaDirigente, nombreDirigente, cedulasVotantes } = req.body;

            const cedulasArray =
                Array.isArray(cedulasVotantes)
                    ? cedulasVotantes
                    : cedulasVotantes.split(',').map((c: string) => Number(c.trim()));
            

            const planilla: CreatePlanillaDTO = {
                cedulaDirigente: Number(cedulaDirigente),
                nombreDirigente,
                cedulaPlanillero: decoded.cedulaPlanillero,
                cedulasVotantes: cedulasArray,
            };

            const planillaResponse = await this.planillaService.createPlanilla(planilla);      
            
            if(!planillaResponse.planillaId){
                if(planillaResponse.cedulasRepetidas.length > 0){
                    return res.status(400).json({
                        success: false,
                        data: planillaResponse,
                        message: "Hay cedulas repetidas"
                    });
                }
                return res.status(400).json({
                    success: false,
                    data: planillaResponse,
                    message: "No se pudo crear la planilla"
                });
            }

            return res.status(201).json({
                success: true,
                data: planillaResponse,
                message: "Planilla creada exitosamente"
            });
        } catch (error) {
            next(error);
        }
    };


    getPlanillas = async(req: Request, res: Response, next: NextFunction) => {
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

            if (!token) return res.status(401);

            const decoded = decodeToken(token);

            if (!decoded?.cedulaPlanillero || !decoded?.nombreCompleto) {
                return res
                    .status(401)
                    .json({ error: 'Error autenticando Token, faltan datos' });
            }

            const { filterText, dateFrom, dateTo, filterSize, filterPage } = req.query;

            const planillaDTO: GetPlanillaDTO = {
                filterText: filterText as string,
                dateFrom: dateFrom as string,
                dateTo: dateTo as string,
                filterSize: Number(filterSize ?? 25),
                filterPage: Number(filterPage ?? 1)
            };

            const planillas = await this.planillaService.getPlanillas(planillaDTO);

            return res.status(200).json(planillas);
        } catch (error) {
            next(error);
        }
    }



}