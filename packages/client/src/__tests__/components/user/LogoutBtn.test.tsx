import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import LogoutBtn from '../../../components/user/LogoutBtn';
import { logoutRequest } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
  ToastContainer: () => null,
}));

describe('LogoutBtn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('dispatches logout request when clicked', () => {
    const { store } = renderWithProviders(<LogoutBtn />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    fireEvent.click(screen.getByText('Logout'));

    expect(store.getActions()).toContainEqual(logoutRequest());
  });

  it('shows success toast and navigates after successful logout', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    const { rerender } = renderWithProviders(<LogoutBtn />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    // Simulate logout success
    rerender(<LogoutBtn />);
    act(() => {
      // Update auth state to simulate successful logout
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
    });

    expect(toast.success).toHaveBeenCalledWith('Logged out successfully');

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders logout button only when authenticated', () => {
    const { rerender } = renderWithProviders(<LogoutBtn />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Rerender with unauthenticated state
    rerender(<LogoutBtn />);
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

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('applies correct styling to logout button', () => {
    renderWithProviders(<LogoutBtn />);
    
    const button = screen.getByText('Logout');
    expect(button.parentElement).toHaveClass('flex', 'justify-end');
  });
}); 