import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { PasswordRecordDetail } from '../../../components/password_records/PasswordRecordDetail';
import { fetchRecordRequest } from '../../../store/slices/passwordRecordsSlice';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('PasswordRecordDetail', () => {
  const mockRecord = {
    id: 1,
    title: 'Test Record',
    username: 'testuser',
    password: 'testpass',
    url: 'https://test.com',
    user: {
      id: 1,
      email: 'test@example.com',
      display_name: 'Test User',
    },
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    display_name: 'Test User',
  };

  it('fetches record on mount', () => {
    const { store } = renderWithProviders(<PasswordRecordDetail />);
    expect(store.getActions()).toContainEqual(fetchRecordRequest(1));
  });

  it('displays record details', () => {
    renderWithProviders(<PasswordRecordDetail />, {
      preloadedState: {
        passwordRecords: {
          currentRecord: mockRecord,
          records: [],
          sharedRecords: [],
          isLoading: false,
          error: null,
        },
        auth: {
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText(mockRecord.title)).toBeInTheDocument();
    expect(screen.getByText(mockRecord.username)).toBeInTheDocument();
    expect(screen.getByText(mockRecord.password)).toBeInTheDocument();
    expect(screen.getByText(mockRecord.url)).toBeInTheDocument();
    expect(screen.getByText(mockRecord.user.display_name)).toBeInTheDocument();
  });

  it('shows edit and delete buttons for record owner', () => {
    renderWithProviders(<PasswordRecordDetail />, {
      preloadedState: {
        passwordRecords: {
          currentRecord: mockRecord,
          records: [],
          sharedRecords: [],
          isLoading: false,
          error: null,
        },
        auth: {
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText(/edit this record/i)).toBeInTheDocument();
    expect(screen.getByText(/delete this record/i)).toBeInTheDocument();
  });

  it('hides edit and delete buttons for non-owners', () => {
    renderWithProviders(<PasswordRecordDetail />, {
      preloadedState: {
        passwordRecords: {
          currentRecord: mockRecord,
          records: [],
          sharedRecords: [],
          isLoading: false,
          error: null,
        },
        auth: {
          user: { ...mockUser, id: 2 },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.queryByText(/edit this record/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/delete this record/i)).not.toBeInTheDocument();
  });

  it('navigates back to list on button click', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderWithProviders(<PasswordRecordDetail />);

    fireEvent.click(screen.getByText(/back to password list/i));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
}); 