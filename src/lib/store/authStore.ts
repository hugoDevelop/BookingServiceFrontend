import { writable } from 'svelte/store';

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    user: any | null;
}

// Cargar el estado inicial desde localStorage solo en el cliente
let initialAuthState: AuthState = {
    isAuthenticated: false,
    accessToken: null,
    user: null
};

if (typeof window !== 'undefined') {
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
        initialAuthState = JSON.parse(storedAuthState);
    }
}

export const authStore = writable<AuthState>(initialAuthState);

// Suscribirse a los cambios del store y persistir en localStorage solo en el cliente
if (typeof window !== 'undefined') {
    authStore.subscribe((state) => {
        localStorage.setItem('authState', JSON.stringify(state));
    });
}