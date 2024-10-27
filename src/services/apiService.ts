import { get } from 'svelte/store';
import { authStore } from '../lib/store/authStore';
import type { User } from '../models/User';
import type { Reserva } from '../models/Reserva';
import type { Cliente } from '../models/Cliente';
import type { Servicio } from '../models/Servicio';

const API_URL = import.meta.env.VITE_API_URL;

export async function getUserSettings(email: string): Promise<User> {
    const response = await fetch(`${API_URL}/v1/userSettings/${email}`, {
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }

    const data: User = await response.json();
    return data;
}

export async function getReservas(): Promise<Reserva[]> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Reserva/v1/getBookings`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }

    const data: Reserva[] = await response.json();
    return data;
}

export async function saveReserva(reserva: Partial<Reserva>): Promise<void> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Reserva/v1/saveBooking`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reserva)
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }
}

export async function updateReserva(reservaId: number, reserva: Partial<Reserva>): Promise<void> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Reserva/v1/updateBooking/${reservaId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reserva)
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }
}

export async function deleteReserva(reservaId: number): Promise<void> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Reserva/v1/deleteBooking/${reservaId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }
}

export async function getClientes(): Promise<Cliente[]> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Cliente/v1/getClients`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }

    const data: Cliente[] = await response.json();
    return data;
}

export async function saveCliente(cliente: Partial<Cliente>): Promise<void> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Cliente/v1/saveClient`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }
}

export async function updateCliente(clienteId: number, cliente: Partial<Cliente>): Promise<void> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Cliente/v1/updateClient/${clienteId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }
}

export async function deleteCliente(clienteId: number): Promise<void> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Cliente/v1/deleteClient/${clienteId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }
}

export async function getServicios(): Promise<Servicio[]> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Servicio/v1/getServices`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }

    const data: Servicio[] = await response.json();
    return data;
}

export async function saveServicio(servicio: Partial<Servicio>): Promise<void> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Servicio/v1/saveService`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(servicio)
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }
}

export async function updateServicio(servicioId: number, servicio: Partial<Servicio>): Promise<void> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Servicio/v1/updateService/${servicioId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(servicio)
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }
}

export async function deleteServicio(servicioId: number): Promise<void> {
    const { accessToken } = get(authStore);

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(`${API_URL}/api/Servicio/v1/deleteService/${servicioId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        var message = await response.text();
        throw new Error( message );
    }
}
