import { pool } from "../infrastructure/database/dbConnection";
import { CreatePlanillaDTO, PlanillaResponseDTO } from "../models/Planilla";
import logger from "../config/logger";
import { AppError } from "../middlewares/errorHandler";

export interface IPlanillaRepository {
   createPlanilla(planilla: CreatePlanillaDTO): Promise<PlanillaResponseDTO>;   
}

export class PlanillaRepository implements IPlanillaRepository {
    async createPlanilla(planilla: CreatePlanillaDTO): Promise<PlanillaResponseDTO> {
        try{
            const result = await pool.query(
            `SELECT * FROM crear_planilla(
                $1::bigint,
                $2::varchar,
                $3::bigint,
                $4::bigint[]
            )`,
            [
                planilla.cedulaDirigente,
                planilla.nombreDirigente,
                planilla.cedulaPlanillero,
                planilla.cedulasVotantes
            ]
        );

        const planillaResponse: PlanillaResponseDTO = {
            planillaId: result.rows[0].out_planilla_id,
            cedulasRepetidas: result.rows[0].out_cedulas_repetidas,
        };

        return planillaResponse;
        } catch (error) {
            logger.error({
                message: "Error creando planilla",
                planilla,
                error
            });
            throw new AppError('No se pudo crear la planilla', 400);
        }
    }
}