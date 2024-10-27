import type { Cliente } from "./Cliente";
import type { Servicio } from "./Servicio";

export interface Reserva {
    reservaId: number;
    fechaReserva: Date;
    clienteId: number;
    servicioId: number;
    cliente?: Cliente;
    servicio?: Servicio;
}