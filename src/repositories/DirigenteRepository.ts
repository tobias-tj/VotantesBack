import { CreateDirigenteDTO, GetAllDirigenteResponse, GetDirigentesEstadisticasResponse } from "../models/Dirigente";
import { pool } from "../infrastructure/database/dbConnection";
import logger from "../config/logger";

export interface IDirigenteRepository {
    insertDirigente(dirigente: CreateDirigenteDTO): Promise<boolean>;
    findAll(): Promise<GetAllDirigenteResponse[]>;
    getEstadisticas(): Promise<GetDirigentesEstadisticasResponse[]>;
}

export class DirigenteRepository implements IDirigenteRepository {
    async insertDirigente(dirigente: CreateDirigenteDTO): Promise<boolean> {
        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            const query = `INSERT INTO dirigentes (cedula_dirigente, nombre_completo)`
            const value = [
                dirigente.cedulaDirigente,
                dirigente.nombreDirigente
            ]

            await client.query(query, value);
            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error("No se pudo insertar el dirigente")
            throw error;
        } finally {
            client.release();
        }
    }

    async findAll(): Promise<GetAllDirigenteResponse[]> {
        const result = await pool.query(
            `SELECT cedula_dirigente, nombre_completo
             FROM dirigentes`
        );
        const dirigentes: GetAllDirigenteResponse[] = result.rows.map((row) => ({
            cedulaDirigente: row.cedula_dirigente,
            nombreDirigente: row.nombre_completo,
        }));
        return dirigentes;
    }

    async getEstadisticas(): Promise<GetDirigentesEstadisticasResponse[]> {
        const result = await pool.query(
            `
            SELECT
            d.cedula_dirigente,
            d.nombre_completo AS nombre_dirigente,

            COUNT(p.id) AS total_planillas,
            COALESCE(SUM(p.total_enviados), 0) AS total_enviados,
            COALESCE(SUM(p.total_no_existentes), 0) AS total_no_encontrados,

            COALESCE(
                json_agg(
                    json_build_object(
                        'planilla_id', p.id,
                        'fecha_creacion', p.fecha_creacion,
                        'total_enviados', p.total_enviados,
                        'total_no_encontrados', p.total_no_existentes
                    )
                ) FILTER (WHERE p.id IS NOT NULL),
                '[]'
            ) AS planillas

            FROM dirigentes d
            LEFT JOIN planillas p 
                ON p.cedula_dirigente = d.cedula_dirigente

            GROUP BY
                d.cedula_dirigente,
                d.nombre_completo

            ORDER BY total_enviados DESC;
            `
        );

        const dirigentesResult: GetDirigentesEstadisticasResponse[] = result.rows.map((row) => ({
            cedulaDirigente: row.cedula_dirigente,
            nombreDirigente: row.nombre_dirigente,
            totalPlanillas: row.total_planillas,
            totalEnviados: row.total_enviados,
            totalNoEncontrados: row.total_no_encontrados,
            planillas: row.planillas,
        }));
        return dirigentesResult;
    }
}