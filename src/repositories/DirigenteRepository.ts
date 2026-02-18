import { CreateDirigenteDTO } from "../models/Dirigente";
import { pool } from "../infrastructure/database/dbConnection";
import logger from "../config/logger";

export interface IDirigenteRepository {
    insertDirigente(dirigente: CreateDirigenteDTO): Promise<boolean>;
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
}