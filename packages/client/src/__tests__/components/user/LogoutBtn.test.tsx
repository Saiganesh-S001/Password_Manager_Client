import {screen, fireEvent, act, cleanup} from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import LogoutBtn from '../../../components/user/LogoutBtn';
import { logoutRequest } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';
import * as router from 'react-router-dom';

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
    jest.useFakeTimers();
    jest.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    cleanup();
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

    // Simulate logout success
    act(() => {
      store.dispatch({ type: 'auth/logoutSuccess' });
    });

    expect(toast.success).toHaveBeenCalledWith('Logged out successfully');

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders logout button only when authenticated', () => {
    const {store} = renderWithProviders(<LogoutBtn />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();


    act(() => {
      store.dispatch({
        type: 'auth/logoutSuccess',
        // payload: {
        //   user: null,
        //   isAuthenticated: false,
        //   isLoading: false,
        //   error: null,
        // },
      });
    });

    // Check unauthenticated state
    expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
  });

  it('applies correct styling to logout button', () => {
    renderWithProviders(<LogoutBtn />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });
    
    const button = screen.getByText('Logout');
    expect(button.parentElement).toHaveClass('flex', 'justify-end');
  });
}); 