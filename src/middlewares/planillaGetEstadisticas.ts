import { header } from "express-validator";

export const planillaGetEstadisticasValidation = [
    header('authorization')
            .notEmpty()
            .withMessage('El token de autorización es obligatorio.'),
];