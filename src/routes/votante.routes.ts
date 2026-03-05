// import { Router } from "express";
// import { VotanteRepository } from "../repositories/VotanteRepository";
// import { VotanteService } from "../services/VotanteService";
// import { VotanteController } from "../controllers/VotanteController";
// import { localesVotanteValidator } from "../middlewares/localesVotanteValidation";

// const router = Router();

// const votanteRepository = new VotanteRepository();
// const votanteService = new VotanteService(votanteRepository);
// const votanteController = new VotanteController(votanteService);

// /**
//  * @swagger
//  * components:
//  *  schemas:
//  *    Votante:
//  *      type: object
//  *      properties:
//  *        cedula:
//  *          type: number
//  *        nombre:
//  *          type: string
//  *        apellido:
//  *          type: string
//  *        sexo:
//  *          type: string
//  *        fechaNacimiento:
//  *          type: Date
//  *        fechaInscripcion:
//  *          type: Date
//  *        tipo:
//  *          type: string
//  *        direccion:
//  *          type: string
//  *        votoPlra:
//  *          type: string
//  *        votoAnr:
//  *          type: string
//  *        votoGenerales:
//  *          type: string
//  *        afiliaciones:
//  *          type: string
//  *        afiliadoPlra2025:
//  *          type: string
//  *        departamentoNombre:
//  *          type: string
//  *        distritoNombre:
//  *          type: string
//  *        zonaNombre:
//  *          type: string
//  *        comiteNombre:
//  *          type: string
//  *        localGenerales:
//  *          type: string
//  *        localInterna:
//  *          type: string
//  * /api/votantes:
//  *   get:
//  *     summary: Get all votantes
//  *     tags: [Votantes]
//  *     responses:
//  *       200:
//  *         description: List of votantes
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Votante'
//  */
// router.get('/', votanteController.getAllVotantes);

// /**
//  * @swagger
//  * /api/votantes/id/{cedula}:
//  *   get:
//  *     summary: Get votante by cedula
//  *     tags: [Votantes]
//  *     parameters:
//  *       - in: path
//  *         name: cedula
//  *         schema:
//  *           type: number
//  *         required: true
//  *         description: The votante cedula
//  *     responses:
//  *       200:
//  *         description: Votante description by cedula
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Votante'
//  *       404:
//  *         description: The votante was not found
//  */
// router.get('/id/:cedula', votanteController.getVotanteByCedula);

// /**
//  * @swagger
//  * /api/votantes/local/{typeLocal}/{localName}:
//  *   get:
//  *     summary: Get votantes by local
//  *     tags: [Votantes]
//  *     parameters:
//  *       - in: path
//  *         name: typeLocal
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The type of local (local_generales or local_interna)
//  *       - in: path
//  *         name: localName
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The name of the local
//  *     responses:
//  *       200:
//  *         description: List of votantes by local
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Votante'
//  */
// router.get('/local/:typeLocal/:localName',
//     [...localesVotanteValidator],
//     votanteController.getVotanteByLocal,
//  );

// /**
//  * @swagger
//  * /api/votantes/localInternaOptions:
//  *   get:
//  *     summary: Get local interna options
//  *     tags: [Votantes]
//  *     responses:
//  *       200:
//  *         description: List of local interna options
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: string
//  */
// router.get('/localInternaOptions', votanteController.getLocalInternaOptions);

// /**
//  * @swagger
//  * /api/votantes/localGeneralesOptions:
//  *   get:
//  *     summary: Get local generales options
//  *     tags: [Votantes]
//  *     responses:
//  *       200:
//  *         description: List of local generales options
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: string
//  */
// router.get('/localGeneralesOptions', votanteController.getLocalGeneralesOptions);

// export default router;
