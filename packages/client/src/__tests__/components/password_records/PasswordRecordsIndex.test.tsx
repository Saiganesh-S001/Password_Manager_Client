import {screen} from '@testing-library/react'
import { renderWithRouterAndStore } from '../../test-utils';
import { PasswordRecordsIndex } from '../../../components/password_records/PasswordRecordsIndex';
import { fetchRecordsRequest } from '../../../store/slices/passwordRecordsSlice';
import { BrowserRouter } from 'react-router-dom';


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
  const navigate = jest.fn();
  jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

  it('redirects to login when not authenticated', async () => {
    // Create a mock for the Navigate component
    const mockNavigate = jest.fn().mockReturnValue(null);
    jest.spyOn(require('react-router-dom'), 'Navigate').mockImplementation(
      (props: any) => {
        mockNavigate(props.to);
        return null;
      }
    );
    
    renderWithRouterAndStore(
      <BrowserRouter>
        <PasswordRecordsIndex />
      </BrowserRouter>,
      {
        preloadedState: { auth: { isAuthenticated: false, user: null, isLoading: false, error: null } },
      }
    );

    // Check that Navigate was called with /login
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    // The main content shouldn't be rendered when redirecting
    expect(screen.queryByText('Password Records')).not.toBeInTheDocument();
    expect(screen.queryByTestId('password-record-list')).not.toBeInTheDocument();
  });

  it('renders components when authenticated', () => {
    renderWithRouterAndStore(
      <BrowserRouter>
        <PasswordRecordsIndex />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            user: { id: 1, email: 'test@example.com', display_name: 'Test User' },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          },
        },
      }
    );

    expect(screen.getByText('Password Records')).toBeInTheDocument();
    expect(screen.getByTestId('password-record-list')).toBeInTheDocument();
    expect(screen.getByTestId('shared-with-me-list')).toBeInTheDocument();
    expect(screen.getByTestId('shared-records-page')).toBeInTheDocument();
  });

  it('fetches records on mount when authenticated', () => {
    const { store } = renderWithRouterAndStore(
      <BrowserRouter>
        <PasswordRecordsIndex />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            user: { id: 1, email: 'test@example.com', display_name: 'Test User' },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          },
        },
      }
    );

    expect(store.getActions()).toContainEqual(fetchRecordsRequest({}));
  });

  it('shows new record button when authenticated', () => {
    renderWithRouterAndStore(
      <BrowserRouter>
        <PasswordRecordsIndex />
      </BrowserRouter>,
      {
        preloadedState: {
          auth: {
            user: { id: 1, email: 'test@example.com', display_name: 'Test User' },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          },
        },
      }
    );

    const newButton = screen.getByText('New');
    expect(newButton).toBeInTheDocument();
    expect(newButton.closest('a')).toHaveAttribute('href', '/passwords/new');
  });
}); 