import bcrypt from 'bcrypt';
import logger from "../config/logger";
import { pool } from "../infrastructure/database/dbConnection";
import { AppError } from "../middlewares/errorHandler";
import { CreatePlanilleroDTO } from '../models/Planillero';

export interface IPlanilleroRepository {
    loginAccount(
        cedulaPlanillero: number,
        password: string
    ): Promise<{ isAdmin: boolean }>;
    registerPlanillero(data: CreatePlanilleroDTO): Promise<void>
}

export class PlanilleroRepository implements IPlanilleroRepository {

    async loginAccount(
        cedulaPlanillero: number,
        password: string
    ): Promise<{ isAdmin: boolean }> {

        const result = await pool.query(
            `SELECT cedula_planillero, password_hash, rol
             FROM planilleros
             WHERE cedula_planillero = $1`,
            [cedulaPlanillero]
        );

        if (result.rows.length === 0) {
            throw new AppError("Credenciales inválidas", 401);
        }

        const planillero = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            planillero.password_hash
        );

        if (!passwordMatch) {
            throw new AppError("Credenciales inválidas", 401);
        }

        return {
            isAdmin: planillero.rol === 'admin'
        };
    }

    async registerPlanillero(data: CreatePlanilleroDTO): Promise<void> {

        const existing = await pool.query(
            `SELECT 1 FROM planilleros WHERE cedula_planillero = $1`,
            [data.cedulaPlanillero]
        );

        if (existing.rows.length > 0) {
            throw new AppError("El planillero ya existe", 400);
        }

        const passwordHash = await bcrypt.hash(data.password, 12);

        await pool.query(
            `INSERT INTO planilleros 
            (cedula_planillero, nombre_completo, password_hash)
            VALUES ($1, $2, $3)`,
            [
                data.cedulaPlanillero,
                data.nombreCompleto,
                passwordHash
            ]
        );
    }
}
