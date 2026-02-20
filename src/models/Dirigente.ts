
export interface CreateDirigenteDTO  {
    cedulaDirigente: number;
    nombreDirigente: string;
}

export interface GetAllDirigenteResponse {
    cedulaDirigente: number;
    nombreDirigente: string;
}


export interface EstadisticaDirigenteDTO {
    planillaId: number;
    fechaCreacion: string;
    totalEnviados: number;
    totalNoEncontrados: number;
}

export interface GetDirigentesEstadisticasResponse {
    cedulaDirigente: number;
    nombreDirigente: string;
    totalPlanillas: number;
    totalEnviados: number;
    totalNoEncontrados: number;
    planillas: EstadisticaDirigenteDTO[];
}