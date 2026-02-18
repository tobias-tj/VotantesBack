import { header, query } from "express-validator";

export const planillaGetValidation = [
      header('authorization')
        .notEmpty()
        .withMessage('El token de autorización es obligatorio.'),

    query('filterText')
        .optional()
        .isString()
        .withMessage('El filtro de texto debe ser una cadena.'),

    query('filterDate')
        .optional()
        .isString()
        .withMessage('El filtro de fecha debe ser una cadena.'),

    query('filterSize')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El filtro de tamaño debe ser un número entero positivo.'),

    query('filterPage')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El filtro de página debe ser un número entero positivo.'),
]