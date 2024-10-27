import type { Company } from "./Company";

export interface Cliente {
    clienteId: number;
    nombre: string;
    email: string;
    telefono: string;
    companyId: number;
    company?: Company;
}