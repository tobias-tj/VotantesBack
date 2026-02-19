import { header } from "express-validator";

export const GetDirigentesValidator = [
     header('authorization')
     .notEmpty()
     .withMessage('El token de autorización es obligatorio.'),
]