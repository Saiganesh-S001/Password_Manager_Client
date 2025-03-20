import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { PasswordRecordsIndex } from '../../../components/password_records/PasswordRecordsIndex';
import { fetchRecordsRequest } from '../../../store/slices/passwordRecordsSlice';

jest.mock('../../../components/password_records/PasswordRecordList', () => ({
  PasswordRecordList: () => <div data-testid="password-record-list">Password Record List</div>,
}));

jest.mock('../../../components/shared_password_records/SharedWithMeList', () => ({
  SharedWithMeList: () => <div data-testid="shared-with-me-list">Shared With Me List</div>,
}));

jest.mock('../../../pages/ShareRecordsPage', () => ({
  SharedRecordsPage: () => <div data-testid="shared-records-page">Shared Records Page</div>,
}));

describe('PasswordRecordsIndex', () => {
  it('shows login message when not authenticated', () => {
    renderWithProviders(<PasswordRecordsIndex />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText(/please login to view your password records/i)).toBeInTheDocument();
  });

  it('renders components when authenticated', () => {
    renderWithProviders(<PasswordRecordsIndex />, {
      preloadedState: {
        auth: {
          user: { id: 1, email: 'test@example.com', display_name: 'Test User' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('Password Records')).toBeInTheDocument();
    expect(screen.getByTestId('password-record-list')).toBeInTheDocument();
    expect(screen.getByTestId('shared-with-me-list')).toBeInTheDocument();
    expect(screen.getByTestId('shared-records-page')).toBeInTheDocument();
  });

  it('fetches records on mount when authenticated', () => {
    const { store } = renderWithProviders(<PasswordRecordsIndex />, {
      preloadedState: {
        auth: {
          user: { id: 1, email: 'test@example.com', display_name: 'Test User' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(store.getActions()).toContainEqual(fetchRecordsRequest({}));
  });

  it('shows new record button when authenticated', () => {
    renderWithProviders(<PasswordRecordsIndex />, {
      preloadedState: {
        auth: {
          user: { id: 1, email: 'test@example.com', display_name: 'Test User' },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('New').closest('a')).toHaveAttribute('href', '/passwords/new');
  });
}); 