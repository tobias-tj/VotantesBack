// import { pool } from "../infrastructure/database/dbConnection";
// import { Votante, VotanteByLocalDTO } from "../models/Votante";


// export interface IVotanteRepository {
//     findAll(): Promise<Votante[]>;
//     findById(cedula: number): Promise<Votante | null>;
//     findByLocal(votantesByLocal: VotanteByLocalDTO): Promise<Votante[]>;
//     getLocalInternaOptions(): Promise<string[]>;
//     getLocalGeneralesOptions(): Promise<string[]>;
// }

// export class VotanteRepository implements IVotanteRepository {
//     async findAll(): Promise<Votante[]> {
//         const result = await pool.query('SELECT * FROM votantes_center LIMIT 10')
//         return result.rows
//     }
//     async findById(cedula: number): Promise<Votante | null> {
//         const result = await pool.query('SELECT * FROM votantes_center WHERE cedula = $1', [cedula])
//         return result.rows[0] || null
//     }

//     async findByLocal(votantesByLocal: VotanteByLocalDTO): Promise<Votante[]> {
//         // Validamos que typeLocal sea una columna permitida
//         const allowedColumns = ['local_generales', 'local_interna'];
//         if (!allowedColumns.includes(votantesByLocal.typeLocal)) {
//             throw new Error('Invalid local type');
//         }

//         // Construimos la query dinámicamente SOLO para la columna (segura)
//         const query = `SELECT * FROM votantes_center WHERE ${votantesByLocal.typeLocal} = $1 LIMIT 10`;

//         const result = await pool.query(query, [votantesByLocal.localName]);
//     return result.rows;
//     }

//     async getLocalInternaOptions(): Promise<string[]> {
//         const result = await pool.query('SELECT DISTINCT local_interna FROM votantes_center');
//         const locals = result.rows.map((row: any) => row.local_interna);
//         return locals;
//     }

//     async getLocalGeneralesOptions(): Promise<string[]> {
//         const result = await pool.query('SELECT DISTINCT local_generales FROM votantes_center');
//         const locals = result.rows.map((row: any) => row.local_generales);
//         return locals;
//     }
// }