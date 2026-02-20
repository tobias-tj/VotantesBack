import { pool } from "../infrastructure/database/dbConnection";
import { CreatePlanillaDTO, GetEstadisticasResponseDTO, GetPlanillaDTO, GetPlanillaResponseDTO, PlanillaResponseDTO } from "../models/Planilla";
import logger from "../config/logger";
import { AppError } from "../middlewares/errorHandler";
import { PaginatedResponse } from "../models/PaginatedResponse";

export interface IPlanillaRepository {
   createPlanilla(planilla: CreatePlanillaDTO): Promise<PlanillaResponseDTO>;   
   getPlanillas(planillaDTO: GetPlanillaDTO): Promise<PaginatedResponse<GetPlanillaResponseDTO>>;
   getEstadisticas(): Promise<GetEstadisticasResponseDTO>;
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
            totalInsertados: result.rows[0].out_total_insertados,
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

    async getPlanillas(planillaDTO: GetPlanillaDTO): Promise<PaginatedResponse<GetPlanillaResponseDTO>> {
        try {

            const size = Math.min(planillaDTO.filterSize || 25, 25);
            const page = planillaDTO.filterPage || 1;
            const offset = (page - 1) * size;

            const result = await pool.query(
            `
            WITH planillas_filtradas AS (
            SELECT
                p.id,
                p.cedula_dirigente,
                d.nombre_completo AS nombre_dirigente,
                p.fecha_creacion,
                p.cedula_planillero,
                pl.nombre_completo AS nombre_planillero,
                p.total_enviados,
                p.total_validos,
                p.total_no_existentes
            FROM planillas p
            JOIN dirigentes d 
                ON d.cedula_dirigente = p.cedula_dirigente
            JOIN planilleros pl
                ON pl.cedula_planillero = p.cedula_planillero
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
            ),
            total_count AS (
                SELECT COUNT(*) AS total FROM planillas_filtradas
            ),
            planillas_paginadas AS (
                SELECT *
                FROM planillas_filtradas
                ORDER BY fecha_creacion DESC
                LIMIT $4
                OFFSET $5
            )

            SELECT
                pp.*,
                tc.total AS total_elements,
                CEIL(tc.total::decimal / $4)::int AS total_pages,
                $6::int AS current_page,
                $4::int AS page_size,
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
            CROSS JOIN total_count tc
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
                pp.nombre_planillero,
                pp.total_enviados,
                pp.total_validos,
                pp.total_no_existentes,
                tc.total
            ORDER BY pp.fecha_creacion DESC;

            `,
            [
                planillaDTO.filterText || null,
                planillaDTO.dateFrom || null,
                planillaDTO.dateTo || null,
                size,
                offset,
                page
            ]
            );

            const rows = result.rows;

            const totalElements = rows.length > 0 ? Number(rows[0].total_elements) : 0;
            const totalPages = rows.length > 0 ? Number(rows[0].total_pages) : 0;

            return {
                page,
                size,
                totalElements,
                totalPages,
                content: rows.map(row => ({
                    id: row.id,
                    cedulaDirigente: row.cedula_dirigente,
                    nombreDirigente: row.nombre_dirigente,
                    fechaCreacion: row.fecha_creacion,
                    cedulaPlanillero: row.cedula_planillero,
                    nombrePlanillero: row.nombre_planillero,
                    totalEnviados: row.total_enviados,
                    totalValidos: row.total_validos,
                    totalNoExistentes: row.total_no_existentes,
                    votantes: row.votantes
                }))
            };

        } catch (error) {
            logger.error({
                message: "Error obteniendo planillas",
                planillaDTO,
                error
            });
            throw new AppError('No se pudo obtener las planillas', 400);
        }
    }

    async getEstadisticas(): Promise<GetEstadisticasResponseDTO> {
        try {
            const result = await pool.query(
            `
            SELECT
                COUNT(*) AS total_planillas,
                COALESCE(SUM(total_enviados), 0) AS total_enviados,
                COALESCE(SUM(total_validos), 0) AS total_validos,
                COALESCE(SUM(total_no_existentes), 0) AS total_no_encontrados
            FROM planillas;
            `
            );
            const row = result.rows[0];

            return {
                totalPlanillas: Number(row.total_planillas),
                totalEnviados: Number(row.total_enviados),
                totalValidos: Number(row.total_validos),
                totalNoEncontrados: Number(row.total_no_encontrados)
            };

        } catch (error) {
            logger.error({
                message: "Error obteniendo estadisticas",
                error
            });
            throw new AppError('No se pudo obtener las estadisticas', 400);
        }
    }

}