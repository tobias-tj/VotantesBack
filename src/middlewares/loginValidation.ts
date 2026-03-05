import { body } from 'express-validator';

export const loginValidation = [
  body('cedulaPlanillero')
    .notEmpty()
    .withMessage('La cedula del planillero es obligatoria')
    .isNumeric()
    .withMessage('Debe ser un numero valido'),
  body('password').notEmpty().withMessage('El password es obligatorio'),
  body('selectedCityType').notEmpty().withMessage('El tipo de ciudad es obligatorio').isNumeric().withMessage('Debe ser un numero valido'),
];
