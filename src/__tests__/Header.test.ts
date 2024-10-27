import { render, fireEvent } from '@testing-library/svelte';
import Header from '../lib/components/Header.svelte';
import { authStore } from '../lib/store/authStore';
import { logout } from '../services/authService';
import '@testing-library/jest-dom'; // Asegúrate de importar esto

// Mock the authStore and logout function
vi.mock('../../store/authStore');
vi.mock('../../services/authService');

describe('Header Component', () => {
    beforeEach(() => {
        // Reset the authStore mock
        authStore.subscribe = vi.fn().mockImplementation((callback) => {
            callback({
                isAuthenticated: true,
                user: {
                    name: 'John Doe',
                    company: {
                        name: 'Test Company'
                    }
                }
            });
            return vi.fn();
        });
    });

    it('renders company name and user name when authenticated', () => {
        const { getByText } = render(Header);

        expect(getByText('Test Company')).toBeInTheDocument();
        expect(getByText('John Doe')).toBeInTheDocument();
    });

    it('calls logout function on logout click', async () => {
        const { getByText } = render(Header);
        const logoutLink = getByText('Logout');

        await fireEvent.click(logoutLink);

        expect(logout).toHaveBeenCalled();
    });
});
