export interface Votante {
   cedula: number;
   nombre: string;
   apellido: string;
   sexo: string;
   fechaNacimiento: Date;
   fechaInscripcion: Date;
   tipo: string;
   direccion: string;
   votoPlra: string;
   votoAnr: string;
   votoGenerales: string;
   afiliaciones: string;
   afiliadoPlra2025: string;
   departamentoNombre: string;
   distritoNombre: string;
   zonaNombre: string;
   comiteNombre: string;
   localGenerales: string;
   localInterna: string;
}

export interface VotanteByLocalDTO {
    typeLocal: string;
    localName: string;
}