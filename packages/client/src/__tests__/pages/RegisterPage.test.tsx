import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { RegisterPage } from '../../pages/RegisterPage';
import { renderWithProviders } from '../test-utils';
import { registerRequest } from '../../store/slices/authSlice';
import {toast} from "react-toastify";



// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

describe('RegisterPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
  });

  it('renders registration form correctly', () => {
    renderWithProviders(<RegisterPage />);
    // get sign up button
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<RegisterPage />);

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText('Display name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('dispatches registerRequest with form data', async () => {
    const { store } = renderWithProviders(<RegisterPage />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/display name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    const actions = store.getActions();
    expect(actions).toContainEqual(
      registerRequest({
        display_name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
    );
  });

  it('shows loading state while registering', () => {
    renderWithProviders(<RegisterPage />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: true,
          error: null,
        },
      },
    });

    expect(screen.getByRole('button', { name: /registering/i })).toBeDisabled();
  });

  it('displays error message when registration fails', () => {
    renderWithProviders(<RegisterPage />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Email already exists',
        },
      },
    });

    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });

  it('navigates to home page on successful registration', async () => {
    renderWithProviders(<RegisterPage />, {
      preloadedState: {
        auth: {
          user: {
            id: 1,
            email: 'test@example.com',
            display_name: 'Test User',
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Registration successful!');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/passwords');
    }, { timeout: 1100 }); // slightly longer than setTimeout in component
  });
}); 