import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { LoginPage } from '../../pages/LoginPage';
import { renderWithProviders } from '../test-utils';
import { loginRequest } from '../../store/slices/authSlice';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

describe('LoginPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
  });

  it('renders login form correctly', () => {
    renderWithProviders(<LoginPage />);
    const loginBtn = screen.getByRole('button', { name: /Log in/i });
    expect(loginBtn).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account? Sign up")).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('dispatches loginRequest with form data', async () => {
    const { store } = renderWithProviders(<LoginPage />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    });

    const actions = store.getActions();
    expect(actions).toContainEqual(
      loginRequest({
        email: 'test@example.com',
        password: 'password123',
      })
    );
  });

  it('shows loading state while logging in', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: true,
          error: null,
        },
      },
    });

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  it('displays error toast when login fails', async () => {
    const { toast } = require('react-toastify');
    
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Invalid credentials',
        },
      },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed');
    });
  });

  it('shows success toast and navigates to home page on successful login', async () => {
    const { toast } = require('react-toastify');
    
    renderWithProviders(<LoginPage />, {
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
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/passwords');
    }, { timeout: 1100 });
  });

  it('navigates to register page when signup link is clicked', () => {
    renderWithProviders(<LoginPage />);
    
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});