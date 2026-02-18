import { body } from "express-validator";

export const registerValidation = [
    body('cedulaPlanillero')
        .notEmpty().withMessage('La cedula es requerida')
        .isLength({ min: 7 }).withMessage('La cedula debe tener al menos 7 digitos')
        .isLength({ max: 10 }).withMessage('La cedula debe tener a lo sumo 10 digitos')
        .isNumeric().withMessage('La cedula debe ser numerica'),
    body('nombreCompleto')
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
        .isLength({ max: 100 }).withMessage('El nombre debe tener a lo sumo 100 caracteres'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .isLength({ max: 20 }).withMessage('La contraseña debe tener a lo sumo 18 caracteres'),
]