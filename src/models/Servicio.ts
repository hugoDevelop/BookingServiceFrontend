import type { Company } from "./Company";

export interface Servicio {
    servicioId: number;
    nombre: string;
    precio: number;
    companyId: number;
    company?: Company;
}