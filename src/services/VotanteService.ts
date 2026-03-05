// import { AppError } from "../middlewares/errorHandler";
// import { Votante, VotanteByLocalDTO } from "../models/Votante";
// // import { IVotanteRepository } from "../repositories/VotanteRepository";

// export class VotanteService {
//     constructor(private votanteRepository: IVotanteRepository) {}

//     async getAllVotantes(): Promise<Votante[]> {
//         return this.votanteRepository.findAll();
//     }

//     async getVotanteByCedula(cedula: number): Promise<Votante> {
//         const votante = await this.votanteRepository.findById(cedula);
//         if (!votante) {
//             throw new AppError('Votante not found', 404);
//         }
//         return votante;
//     }

//     async getLocalInternaOptions(): Promise<string[]> {
//         return this.votanteRepository.getLocalInternaOptions();
//     }

//     async getLocalGeneralesOptions(): Promise<string[]> {
//         return this.votanteRepository.getLocalGeneralesOptions();
//     }

//     async getVotanteByLocal(votantesByLocal: VotanteByLocalDTO): Promise<Votante[]> {
//         return this.votanteRepository.findByLocal(votantesByLocal);
//     }
// }