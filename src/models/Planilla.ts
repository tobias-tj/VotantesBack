import { Votante } from "./Votante";

export interface CreatePlanillaDTO {
    cedulaDirigente: number;
    nombreDirigente: string;
    cedulaPlanillero: number;
    cedulasVotantes: number[];
    selectedCityType: number;
}

export interface PlanillaResponseDTO {
    planillaId: number;
    cedulasRepetidas: number[];
    totalInsertados: number;
}

export interface GetPlanillaDTO {
    filterText?: string;
    dateFrom?: string;
    dateTo?: string;
    filterSize: number;
    filterPage: number;
    selectedCityType: number;
}

export interface GetPlanillaResponseDTO {
    id: number;
    cedulaDirigente: number;
    nombreDirigente: string;
    fechaCreacion: Date;
    cedulaPlanillero: number;
    nombrePlanillero: string;
    totalEnviados: number;
    totalValidos: number;
    totalNoExistentes: number;
    votantes: Votante[];
}

export interface GetEstadisticasResponseDTO {
    totalPlanillas: number;
    totalEnviados: number;
    totalValidos: number;
    totalNoEncontrados: number;
}

