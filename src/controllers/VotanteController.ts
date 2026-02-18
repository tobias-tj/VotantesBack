import { NextFunction, Request, Response } from "express";
import { VotanteService } from "../services/VotanteService";
import { validationResult } from "express-validator";
import { VotanteByLocalDTO } from "../models/Votante";

export class VotanteController {
    constructor(private votanteService: VotanteService) {}


    getAllVotantes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const votantes = await this.votanteService.getAllVotantes();
            res.json({ status: 'success', data: votantes });
        } catch (error) {
            next(error);
        }
    };

    getVotanteByCedula = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const votante = await this.votanteService.getVotanteByCedula(Number(req.params.cedula));
            res.json({ status: 'success', data: votante });
        } catch (error) {
            next(error);
        }
    };

    getLocalInternaOptions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const localInterna = await this.votanteService.getLocalInternaOptions();
            res.json({ status: 'success', data: localInterna });
        } catch (error) {
            next(error);
        }
    };

    getLocalGeneralesOptions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const localGenerales = await this.votanteService.getLocalGeneralesOptions();
            res.json({ status: 'success', data: localGenerales });
        } catch (error) {
            next(error);
        }
    };

    getVotanteByLocal = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // const authHeader = req.headers.authorization;
            // const token =
            //     authHeader && authHeader.startsWith('Bearer ')
            //     ? authHeader.substring(7)
            //     : null;

            // if (!token) return res.status(401);

            // const decoded = decodeToken(token);

            // if (!decoded?.parentId || !decoded?.email) {
            //     return res
            //     .status(401)
            //     .json({ error: 'Error autenticando Token, faltan datos' });
            // }

            const {typeLocal, localName} = req.params;
            const votantesByLocal: VotanteByLocalDTO = {
                typeLocal,
                localName,
            };

            const result = await this.votanteService.getVotanteByLocal(votantesByLocal);
            if(!result || result.length === 0) {
                return res.status(200).json({ success: true, data: [] });
            }

           return res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}