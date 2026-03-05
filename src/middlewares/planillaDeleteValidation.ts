import { header, param, query } from "express-validator";

export const planillaDeleteValidation = [
    header('authorization')
        .notEmpty()
        .withMessage('El token de autorización es obligatorio.'),
    param('idPlanilla')
        .notEmpty()
        .withMessage('El ID de la planilla es obligatorio.')
        .isInt()
        .withMessage('Debe ser un número.'),

    query('deleteDirigente')
        .notEmpty()
        .withMessage('deleteDirigente es obligatorio.')
        .isBoolean()
        .withMessage('Debe ser booleano')
];