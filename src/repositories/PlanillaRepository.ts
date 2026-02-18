import { pool } from "../infrastructure/database/dbConnection";
import { CreatePlanillaDTO, GetPlanillaDTO, GetPlanillaResponseDTO, PlanillaResponseDTO } from "../models/Planilla";
import logger from "../config/logger";
import { AppError } from "../middlewares/errorHandler";

export interface IPlanillaRepository {
   createPlanilla(planilla: CreatePlanillaDTO): Promise<PlanillaResponseDTO>;   
   getPlanillas(planillaDTO: GetPlanillaDTO): Promise<GetPlanillaResponseDTO[]>;
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

    async getPlanillas(planillaDTO: GetPlanillaDTO): Promise<GetPlanillaResponseDTO[]> {
        try {

            const size = Math.min(planillaDTO.filterSize || 25, 25);
            const page = planillaDTO.filterPage || 1;
            const offset = (page - 1) * size;

            const result = await pool.query(
            `
            WITH planillas_paginadas AS (
                SELECT
                    p.id,
                    p.cedula_dirigente,
                    d.nombre_completo AS nombre_dirigente,
                    p.fecha_creacion,
                    p.cedula_planillero,
                    p.total_enviados,
                    p.total_validos,
                    p.total_no_existentes
                FROM planillas p
                JOIN dirigentes d 
                    ON d.cedula_dirigente = p.cedula_dirigente
                WHERE
                    (
                        $1::text IS NULL
                        OR p.cedula_dirigente::text = $1
                        OR d.nombre_completo ILIKE '%' || $1 || '%'
                    )
                AND (
                        $2::date IS NULL
                        OR p.fecha_creacion >= $2
                    )
                AND (
                        $3::date IS NULL
                        OR p.fecha_creacion <= $3
                    )
                ORDER BY p.fecha_creacion DESC
                LIMIT $4
                OFFSET $5
            )

            SELECT
                pp.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'cedula_votante', pv.cedula_votante,
                            'nombre', vc.nombre,
                            'apellido', vc.apellido,
                            'sexo', vc.sexo,
                            'fecha_nacimiento', vc.fecha_nacimiento,
                            'fecha_inscripcion', vc.fecha_inscripcion,
                            'tipo', vc.tipo,
                            'direccion', vc.direccion,
                            'voto_plra', vc.voto_plra,
                            'voto_anr', vc.voto_anr,
                            'voto_generales', vc.voto_generales,
                            'afiliaciones', vc.afiliaciones,
                            'afiliado_plra_2025', vc.afiliado_plra_2025,
                            'departamento_nombre', vc.departamento_nombre,
                            'distrito_nombre', vc.distrito_nombre,
                            'zona_nombre', vc.zona_nombre,
                            'comite_nombre', vc.comite_nombre,
                            'local_generales', vc.local_generales,
                            'local_interna', vc.local_interna
                        )
                    ) FILTER (WHERE pv.cedula_votante IS NOT NULL),
                    '[]'
                ) AS votantes
            FROM planillas_paginadas pp
            LEFT JOIN planilla_votantes pv 
                ON pv.planilla_id = pp.id
            LEFT JOIN votantes_center vc 
                ON vc.cedula = pv.cedula_votante
            GROUP BY
                pp.id,
                pp.cedula_dirigente,
                pp.nombre_dirigente,
                pp.fecha_creacion,
                pp.cedula_planillero,
                pp.total_enviados,
                pp.total_validos,
                pp.total_no_existentes
            ORDER BY pp.fecha_creacion DESC;
            `,
            [
                planillaDTO.filterText || null,
                planillaDTO.dateFrom || null,
                planillaDTO.dateTo || null,
                size,
                offset
            ]
            );

            return result.rows;

        } catch (error) {
            logger.error({
                message: "Error obteniendo planillas",
                planillaDTO,
                error
            });
            throw new AppError('No se pudo obtener las planillas', 400);
        }
    }

}