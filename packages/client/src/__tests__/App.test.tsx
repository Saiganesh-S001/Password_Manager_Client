import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, renderWithRouterAndStore } from './test-utils';
import App from '../App';
import { useInactivityTimer } from '../hooks/useInactivityTimer';

/**
 * Mock all child components to simplify testing and
 * focus only on the App component's functionality
 */
jest.mock('../components/layouts/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

jest.mock('../pages/LoginPage', () => ({
  LoginPage: () => <div data-testid="login-page">Login Page</div>,
}));

jest.mock('../pages/RegisterPage', () => ({
  RegisterPage: () => <div data-testid="register-page">Register Page</div>,
}));

jest.mock('../components/password_records/PasswordRecordsIndex', () => ({
  PasswordRecordsIndex: () => <div data-testid="records-index">Password Records Index</div>,
}));

jest.mock('../components/password_records/PasswordRecordDetail', () => ({
  PasswordRecordDetail: () => <div data-testid="record-detail">Password Record Detail</div>,
}));

jest.mock('../components/password_records/EditPasswordRecord', () => ({
  __esModule: true,
  default: () => <div data-testid="edit-record">Edit Password Record</div>,
}));

jest.mock('../components/password_records/PasswordRecordForm', () => ({
  PasswordRecordForm: () => <div data-testid="record-form">Password Record Form</div>,
}));

jest.mock('../components/user/EditUserProfile', () => ({
  EditProfile: () => <div data-testid="edit-profile">Edit Profile</div>,
}));

// Mock useInactivityTimer hook
jest.mock('../hooks/useInactivityTimer');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useInactivityTimer as jest.Mock).mockReturnValue(undefined);
  });

  describe('Layout and Authentication', () => {
    it('renders the layout wrapper around all content', () => {
      renderWithProviders(<App />);
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('initializes inactivity timer when user is authenticated', () => {
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

    it('does not initialize inactivity timer when user is not authenticated', () => {
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
  });

  describe('Routing', () => {
    it('renders login page at /login route', () => {
      renderWithRouterAndStore(<App />, {
        route: '/login'
      });
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('renders register page at /register route', () => {
      renderWithRouterAndStore(<App />, {
        route: '/register'
      });
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });

    it('renders password records index at root (/) path', () => {
      renderWithRouterAndStore(<App />, {
        route: '/'
      });
      expect(screen.getByTestId('records-index')).toBeInTheDocument();
    });

    it('renders password records index at /passwords route', () => {
      renderWithRouterAndStore(<App />, {
        route: '/passwords'
      });
      expect(screen.getByTestId('records-index')).toBeInTheDocument();
    });

    it('renders edit profile page at /profile/edit route', () => {
      renderWithRouterAndStore(<App />, {
        route: '/profile/edit'
      });
      expect(screen.getByTestId('edit-profile')).toBeInTheDocument();
    });

    it('renders password record form at /passwords/new route', () => {
      renderWithRouterAndStore(<App />, {
        route: '/passwords/new'
      });
      expect(screen.getByTestId('record-form')).toBeInTheDocument();
    });

    it('renders password record detail at /passwords/:id route', () => {
      renderWithRouterAndStore(<App />, {
        route: '/passwords/1'
      });
      expect(screen.getByTestId('record-detail')).toBeInTheDocument();
    });

    it('renders edit password record at /passwords/:id/edit route', () => {
      renderWithRouterAndStore(<App />, {
        route: '/passwords/1/edit'
      });
      expect(screen.getByTestId('edit-record')).toBeInTheDocument();
    });
  });
}); 