import axios from 'axios';
import { get } from 'svelte/store';
import { authStore } from '../lib/store/authStore';

export const apiService = {
    async getReservations() {
        const { accessToken } = get(authStore);
        const response = await axios.get('/api/reservas', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },
    // Otros métodos de la API (createReservation, updateReservation, etc.)
};
