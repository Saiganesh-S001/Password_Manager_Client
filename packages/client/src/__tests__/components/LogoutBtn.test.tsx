import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import LogoutBtn from '../../components/user/LogoutBtn';
import { renderWithProviders } from '../test-utils';
import { logoutRequest } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
  ToastContainer: () => null,
}));

describe('LogoutBtn', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
  });

  it('renders logout button when authenticated', () => {
    renderWithProviders(<LogoutBtn />, {
      preloadedState: {
        auth: {
          user: { id: 1, email: 'test@example.com', display_name: 'Test User' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('dispatches logoutRequest when clicked', () => {
    const { store } = renderWithProviders(<LogoutBtn />, {
      preloadedState: {
        auth: {
          user: { id: 1, email: 'test@example.com', display_name: 'Test User' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(store.getActions()).toContainEqual(logoutRequest());
  });

  it('shows success toast and navigates after logout', async () => {
    renderWithProviders(<LogoutBtn />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 3000 });
  });
}); 