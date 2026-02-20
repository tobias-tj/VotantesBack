import { CreateDirigenteDTO } from "../models/Dirigente";
import { IDirigenteRepository } from "../repositories/DirigenteRepository";

export class DirigenteService {
    constructor(private dirigenteRepository: IDirigenteRepository) {}

    // async createDirigente(dirigente: CreateDirigenteDTO): Promise<boolean> {
    //     try{
    //         const resultCreateDirigente = await this.dirigenteRepository.insertDirigente(dirigente);
    //         if(!resultCreateDirigente){
    //             throw new Error('No se pudo crear el dirigente');
    //         }
    //         return true;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async getAllDirigentes(){
        return this.dirigenteRepository.findAll();
    }

    async getEstadisticas() {
        return this.dirigenteRepository.getEstadisticas();
    }
}