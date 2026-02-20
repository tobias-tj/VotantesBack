import { CreatePlanillaDTO, GetPlanillaDTO } from "../models/Planilla";
import { IPlanillaRepository } from "../repositories/PlanillaRepository";

export class PlanillaService {
    constructor(private planillaRepository: IPlanillaRepository) {}


    async createPlanilla(planilla: CreatePlanillaDTO) {
        return await this.planillaRepository.createPlanilla(planilla);
    }

    async getPlanillas(planillaDTO: GetPlanillaDTO) {
        return await this.planillaRepository.getPlanillas(planillaDTO);
    }

    async getEstadisticas() {
        return await this.planillaRepository.getEstadisticas();
    }
}