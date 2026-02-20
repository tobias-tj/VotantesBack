import { Router } from "express";
import { loginValidation } from "../middlewares/loginValidation";
import { PlanilleroRepository } from "../repositories/PlanilleroRepository";
import { PlanilleroService } from "../services/PlanilleroService";
import { AccessCheckoutController } from "../controllers/AccessCheckoutController";
import { registerValidation } from "../middlewares/registerValidation";


const router = Router();

const planilleroRepository = new PlanilleroRepository();
const planilleroService = new PlanilleroService(planilleroRepository);
const accessCheckoutController = new AccessCheckoutController(planilleroService);

/**
 * @swagger
 * /api/access/login:
 *   post:
 *     tags: [Access]
 *     summary: Iniciar sesión
 *     description: Iniciar sesión con cédula y contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/login',
    [...loginValidation],
    accessCheckoutController.loginAccount);

if (process.env.NODE_ENV !== 'production') {
    /**
* @swagger
* /api/access/register:
*   post:
*     tags: [Access]
*     summary: Registrar planillero
*     description: Registrar planillero con cédula y contraseña
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Register'
*     responses:
*       201:
*         description: Planillero registrado exitosamente
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/RegisterResponse'
*       400:
*         description: Bad request
*       500:
*         description: Internal server error
*/
    router.post('/register',
        [...registerValidation],
        accessCheckoutController.registerPlanillero);
}

export default router;
