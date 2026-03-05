import { CreatePlanilleroDTO } from "../models/Planillero";
import { IPlanilleroRepository } from "../repositories/PlanilleroRepository";

export class PlanilleroService {
    constructor(private planilleroRepository: IPlanilleroRepository) { }

    async loginAccount(cedulaPlanillero: number, password: string, selectedCityType: number) {
        return await this.planilleroRepository.loginAccount(cedulaPlanillero, password, selectedCityType);
    }

    async registerPlanillero(data: CreatePlanilleroDTO): Promise<void> {
        return await this.planilleroRepository.registerPlanillero(data);
    }
}