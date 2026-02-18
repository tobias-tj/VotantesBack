import { pool } from "../infrastructure/database/dbConnection";
import { CreatePlanillaDTO } from "../models/Planilla";
import logger from "../config/logger";
import { AppError } from "../middlewares/errorHandler";

export interface IPlanillaRepository {
   createPlanilla(planilla: CreatePlanillaDTO): Promise<number>;   
}

export class PlanillaRepository implements IPlanillaRepository {
    async createPlanilla(planilla: CreatePlanillaDTO): Promise<number> {
        try{
            const result = await pool.query(
                `SELECT crear_planilla(
                    $1::bigint,
                    $2::varchar,
                    $3::bigint,
                    $4::bigint[]
                ) AS planilla_id`,
                [
                    planilla.cedulaDirigente,
                    planilla.nombreDirigente,
                    planilla.cedulaPlanillero,
                    planilla.cedulasVotantes
            ]
        );

        return result.rows[0].planilla_id;
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