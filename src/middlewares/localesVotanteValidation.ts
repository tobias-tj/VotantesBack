import { header, param } from 'express-validator';

export const localesVotanteValidator = [
//   header('authorization')
//     .notEmpty()
//     .withMessage('El token de autorización es obligatorio.'),

  param('typeLocal')
    .notEmpty()
    .isIn(['local_generales', 'local_interna'])
    .withMessage('El tipo de local debe ser local_generales o local_interna.'),

  param('localName')
    .notEmpty()
    .withMessage('El nombre del local es obligatorio.'),
];