import { body, header } from "express-validator";

export const planillaCreateValidation = [
    header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),

    body('cedulaDirigente').notEmpty().withMessage('La cédula del dirigente es obligatoria'),
    body('nombreDirigente').notEmpty().withMessage('El nombre del dirigente es obligatorio'),
    body('cedulasVotantes').notEmpty().withMessage('Las cédulas de los votantes son obligatorias'),
]