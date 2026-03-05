import { Router } from "express";
import { DirigenteService } from "../services/DirigenteService";
import { DirigenteRepository } from "../repositories/DirigenteRepository";
import { DirigenteController } from "../controllers/DirigenteController";
import { GetDirigentesValidator } from "../middlewares/GetDirigentesValidator";

const router = Router();

const dirigenteRepository = new DirigenteRepository();
const dirigenteService = new DirigenteService(dirigenteRepository);
const dirigenteController = new DirigenteController(dirigenteService);

/**
 * @swagger
 * /api/dirigente/:
 *  get:
 *    summary: Get all dirigentes
 *    tags: [Dirigentes]
 *    security:
 *       - BearerAuth: []
 *    responses:
 *      200:
 *        description: List of dirigentes
 */
router.get('/', [...GetDirigentesValidator], dirigenteController.getAllDirigentes);

/**
 * @swagger
 * /api/dirigente/obtenerEstadisticas:
 *  get:
 *    summary: Get all dirigentes statistics
 *    tags: [Dirigentes]
 *    security:
 *       - BearerAuth: []
 *    responses:
 *      200:
 *        description: List of dirigentes statistics
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/DirigenteGetEstadisticasResponse'
 */
router.get('/obtenerEstadisticas', dirigenteController.getEstadisticas);

export default router;
