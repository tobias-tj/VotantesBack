import { CreatePlanillaDTO } from "../models/Planilla";
import { IPlanillaRepository } from "../repositories/PlanillaRepository";

export class PlanillaService {
    constructor(private planillaRepository: IPlanillaRepository) {}


    async createPlanilla(planilla: CreatePlanillaDTO): Promise<number> {
        const planillaId = await this.planillaRepository.createPlanilla(planilla);

        if (!planillaId) {
            throw new Error('No se pudo crear la planilla');
        }

        return planillaId;
    }
}