import { CreatePlanillaDTO } from "../models/Planilla";
import { IPlanillaRepository } from "../repositories/PlanillaRepository";

export class PlanillaService {
    constructor(private planillaRepository: IPlanillaRepository) {}


    async createPlanilla(planilla: CreatePlanillaDTO) {
        return await this.planillaRepository.createPlanilla(planilla);
    }
}