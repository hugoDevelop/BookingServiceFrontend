import type { Company, Rol } from "./Company";

export interface User {
    id: number;
    name: string;
    email: string;
    rol: Rol;
    companyId: number;
    company?: Company;
}