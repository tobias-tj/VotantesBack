import { Router } from "express";
import { PlanillaRepository } from "../repositories/PlanillaRepository";
import { PlanillaService } from "../services/PlanillaService";
import { PlanillaController } from "../controllers/PlanillaController";
import { planillaCreateValidation } from "../middlewares/planillaCreateValidation";
import { planillaGetValidation } from "../middlewares/planillaGetValidation";
import { planillaGetEstadisticasValidation } from "../middlewares/planillaGetEstadisticas";
import { planillaDeleteValidation } from "../middlewares/planillaDeleteValidation";

const router = Router();

const planillaRepository = new PlanillaRepository();
const planillaService = new PlanillaService(planillaRepository);
const planillaController = new PlanillaController(planillaService);



/**
 * @swagger
 * /api/planilla/create:
 *   post:
 *     summary: Crear una planilla
 *     tags: [Planilla]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlanillaDTO'
 *     responses:
 *       201:
 *         description: Planilla creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Planilla'
 */
router.post('/create',
    [...planillaCreateValidation],
    planillaController.createPlanilla);


/**
 * @swagger
 * /api/planilla/obtenerPlanillas:
 *   get:
 *     summary: Obtener planillas
 *     tags: [Planilla]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: filterText
 *         in: query
 *         description: Texto de filtro
 *         required: false
 *         schema:
 *           type: string
 *       - name: dateFrom
 *         in: query
 *         description: Fecha de inicio
 *         required: false
 *         schema:
 *           type: string
 *       - name: dateTo
 *         in: query
 *         description: Fecha de fin
 *         required: false
 *         schema:
 *           type: string
 *       - name: filterSize
 *         in: query
 *         description: Tamaño de la página
 *         required: true
 *         schema:
 *           type: integer
 *       - name: filterPage
 *         in: query
 *         description: Número de página
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Planillas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanillaGetValidationResponse'
 */
router.get('/obtenerPlanillas', [...planillaGetValidation], planillaController.getPlanillas);

/**
 * @swagger
 * /api/planilla/obtenerEstadisticas:
 *   get:
 *     summary: Obtener estadisticas
 *     tags: [Planilla]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadisticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetEstadisticasResponseDTO'
 */
router.get('/obtenerEstadisticas', [...planillaGetEstadisticasValidation], planillaController.getEstadisticas);

/**
 * @swagger
 * /api/planilla/borrar/{idPlanilla}:
 *   delete:
 *     summary: Borrar una planilla
 *     tags: [Planilla]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: idPlanilla
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: deleteDirigente
 *         in: query
 *         required: true
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Planilla borrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanillaBorradaResponseDTO'
 */
router.delete('/borrar/:idPlanilla', [...planillaDeleteValidation], planillaController.deletePlanilla);

export default router;