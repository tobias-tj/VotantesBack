export interface CreatePlanillaDTO {
    cedulaDirigente: number;
    nombreDirigente: string;
    cedulaPlanillero: number;
    cedulasVotantes: number[];
}

export interface PlanillaResponseDTO {
    planillaId: number;
    cedulasRepetidas: number[];
}