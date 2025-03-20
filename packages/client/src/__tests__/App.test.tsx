import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import App from '../App';
import { useInactivityTimer } from '../hooks/useInactivityTimer';

// Mock all child components
jest.mock('../components/layouts/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

jest.mock('../pages/LoginPage', () => ({
  LoginPage: () => <div>Login Page</div>,
}));

jest.mock('../pages/RegisterPage', () => ({
  RegisterPage: () => <div>Register Page</div>,
}));

jest.mock('../components/password_records/PasswordRecordsIndex', () => ({
  PasswordRecordsIndex: () => <div>Password Records Index</div>,
}));

jest.mock('../components/password_records/PasswordRecordDetail', () => ({
  PasswordRecordDetail: () => <div>Password Record Detail</div>,
}));

jest.mock('../components/password_records/EditPasswordRecord', () => ({
  __esModule: true,
  default: () => <div>Edit Password Record</div>,
}));

jest.mock('../components/password_records/PasswordRecordForm', () => ({
  PasswordRecordForm: () => <div>Password Record Form</div>,
}));

jest.mock('../components/user/EditUserProfile', () => ({
  EditProfile: () => <div>Edit Profile</div>,
}));

// Mock useInactivityTimer hook
jest.mock('../hooks/useInactivityTimer');

describe('App', () => {
  beforeEach(() => {
    (useInactivityTimer as jest.Mock).mockReturnValue(undefined);
  });

  it('renders layout wrapper', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('initializes inactivity timer when authenticated', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: {
          user: { id: 1, email: 'test@example.com', display_name: 'Test User' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(useInactivityTimer).toHaveBeenCalledWith(true);
  });

  it('does not initialize inactivity timer when not authenticated', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(useInactivityTimer).toHaveBeenCalledWith(false);
  });

  describe('routing', () => {
    it('renders login page at /login', () => {
      renderWithProviders(<App />, {
        initialEntries: ['/login'],
      });
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders register page at /register', () => {
      renderWithProviders(<App />, {
        initialEntries: ['/register'],
      });
      expect(screen.getByText('Register Page')).toBeInTheDocument();
    });

    it('renders password records index at root path', () => {
      renderWithProviders(<App />, {
        initialEntries: ['/'],
      });
      expect(screen.getByText('Password Records Index')).toBeInTheDocument();
    });

    it('renders password records index at /passwords', () => {
      renderWithProviders(<App />, {
        initialEntries: ['/passwords'],
      });
      expect(screen.getByText('Password Records Index')).toBeInTheDocument();
    });

    it('renders edit profile at /profile/edit', () => {
      renderWithProviders(<App />, {
        initialEntries: ['/profile/edit'],
      });
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('renders new password form at /passwords/new', () => {
      renderWithProviders(<App />, {
        initialEntries: ['/passwords/new'],
      });
      expect(screen.getByText('Password Record Form')).toBeInTheDocument();
    });

    it('renders password detail at /passwords/:id', () => {
      renderWithProviders(<App />, {
        initialEntries: ['/passwords/1'],
      });
      expect(screen.getByText('Password Record Detail')).toBeInTheDocument();
    });

    it('renders edit password record at /passwords/:id/edit', () => {
      renderWithProviders(<App />, {
        initialEntries: ['/passwords/1/edit'],
      });
      expect(screen.getByText('Edit Password Record')).toBeInTheDocument();
    });
  });
}); 