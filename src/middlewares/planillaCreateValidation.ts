import { body } from "express-validator";

export const planillaCreateValidation = [
    //   header('authorization')
//     .notEmpty()
//     .withMessage('El token de autorización es obligatorio.'),

// TODO: La cedula de planillero no se obtiene asi realmente pero por ahora vamos a dejar asi
    body('cedulaDirigente').notEmpty().withMessage('La cédula del dirigente es obligatoria'),
    body('nombreDirigente').notEmpty().withMessage('El nombre del dirigente es obligatorio'),
    body('cedulaPlanillero').notEmpty().withMessage('La cédula del planillero es obligatoria'),
    body('cedulasVotantes').notEmpty().withMessage('Las cédulas de los votantes son obligatorias'),
]