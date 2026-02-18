import { Router } from "express";
import { PlanillaRepository } from "../repositories/PlanillaRepository";
import { PlanillaService } from "../services/PlanillaService";
import { PlanillaController } from "../controllers/PlanillaController";
import { planillaCreateValidation } from "../middlewares/planillaCreateValidation";

const router = Router();

const planillaRepository = new PlanillaRepository();
const planillaService = new PlanillaService(planillaRepository);
const planillaController = new PlanillaController(planillaService);



/**
 * @swagger
 * /planilla/create:
 *   post:
 *     summary: Crear una planilla
 *     tags: [Planilla]
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

export default router;