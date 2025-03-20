import { fireEvent, screen, waitFor } from '@testing-library/react';
import { LoginPage } from '../../pages/LoginPage';
import { renderWithProviders, InitialState } from '../test-utils';
import { loginRequest, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { put, take } from 'redux-saga/effects';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

const initialState: InitialState = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,    
  },
  passwordRecords: {
    records: [],
    sharedRecords: [],
    currentRecord: null,
    isLoading: false,
    error: null,
  },
  sharedPasswordRecords: {
    sharedWithMe: [],
    sharedByMe: [],
    isLoading: false,
    error: null,
  },
};

// Mock saga for successful login
function* mockLoginSuccessSaga() {
  while (true) {
    const action = yield take(loginRequest.type);
    yield put(loginSuccess({
      id: '123',
      email: action.payload.email,
      username: 'testuser'
    }));
  }
}

// Mock saga for failed login
function* mockLoginFailureSaga() {
  while (true) {
    yield take(loginRequest.type);
    yield put(loginFailure('Invalid credentials'));
  }
}

describe('LoginPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
  });

  it('renders login form correctly', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('dispatches loginRequest with form data', async () => {
    const { store } = renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      const actions = store.getActions();
      const loginRequestAction = actions.find(
        action => action.type === loginRequest.type
      );
      expect(loginRequestAction).toBeTruthy();
      expect(loginRequestAction.payload).toEqual({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('shows loading state while logging in', () => {
    const loadingState = {
      ...initialState,
      auth: {
        ...initialState.auth,
        isLoading: true
      }
    };
    
    renderWithProviders(<LoginPage />, {
      preloadedState: loadingState
    });

    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();
  });

  it('shows success toast and navigates on successful login', async () => {
    const { store } = renderWithProviders(<LoginPage />, {
      mockSagas: [mockLoginSuccessSaga()],
      preloadedState: initialState
    });

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error toast on login failure', async () => {
    const { store } = renderWithProviders(<LoginPage />, {
      mockSagas: [mockLoginFailureSaga()],
      preloadedState: initialState
    });

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(store.getState().auth.error).toBe('Invalid credentials');
      expect(toast.error).toHaveBeenCalledWith('Login failed');
    });
  });
});