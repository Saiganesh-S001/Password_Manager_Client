import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { SharedRecordsList } from '../../../components/shared_password_records/SharedByMeList';
import { fetchSharedByMeRequest, fetchSharedByMeSuccess, deleteSharedPasswordRecordRequest } from '../../../store/slices/sharedPasswordRecordsSlice';

// Mock the document.getElementById for dropdown functionality
const mockGetElementById = jest.fn();
document.getElementById = mockGetElementById;

// Mock fetch API to prevent actual network requests
jest.mock('../../../client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

describe('SharedRecordsList', () => {
  const mockSharedRecords = [
    {
      id: 1,
      password_record: {
        id: 1,
        title: 'Test Record 1',
        username: 'testuser1',
        password: 'testpass1',
        url: 'https://test1.com',
        user: {
          id: 1,
          email: 'owner@example.com',
          display_name: 'Owner'
        }
      },
      owner: {
        id: 1,
        email: 'owner@example.com',
        display_name: 'Owner'
      },
      collaborator: {
        id: 2,
        email: 'user1@example.com',
        display_name: 'User 1'
      }
    },
    {
      id: 2,
      password_record: {
        id: 2,
        title: 'Test Record 2',
        username: 'testuser2',
        password: 'testpass2',
        url: 'https://test2.com',
        user: {
          id: 1,
          email: 'owner@example.com',
          display_name: 'Owner'
        }
      },
      owner: {
        id: 1,
        email: 'owner@example.com',
        display_name: 'Owner'
      },
      collaborator: {
        id: 2,
        email: 'user1@example.com',
        display_name: 'User 1'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { rerender} = renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: [],
          sharedWithMe: [],
          isLoading: true,
          error: null
        }
      }
    });

    rerender(<SharedRecordsList />);

    expect(screen.getByText('Loading shared records...')).toBeInTheDocument();
  });

  it('dispatches fetchSharedByMeRequest on mount', () => {
    const { store } = renderWithProviders(<SharedRecordsList />);

    expect(store.getActions()).toContainEqual(fetchSharedByMeRequest());
  });

  it('displays empty state message when there are no shared records', () => {
    // Create a mock store that immediately succeeds the fetch request
    const { store, rerender } = renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: [],
          sharedWithMe: [],
          isLoading: true,
          error: null
        }
      }
    });
    act(() => {
      store.dispatch(fetchSharedByMeSuccess([]));
    });

    rerender(<SharedRecordsList />);
    expect(screen.getByText('No users have been granted access yet.')).toBeInTheDocument();
  });

  it('displays shared records grouped by user', () => {
    const { store, rerender } = renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: mockSharedRecords,
          sharedWithMe: [],
          isLoading: false,
          error: null
        }
      }
    });

    act(() => {
      store.dispatch(fetchSharedByMeSuccess(mockSharedRecords));
    });

    rerender(<SharedRecordsList />);

    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('Access to: Test Record 1, Test Record 2')).toBeInTheDocument();
  });

  it('handles removing access to a single record', async () => {
    const { store , rerender} = renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: mockSharedRecords,
          sharedWithMe: [],
          isLoading: false,
          error: null
        }
      }
    });

    act(() => {
      store.dispatch(fetchSharedByMeSuccess(mockSharedRecords));
    });

    rerender(<SharedRecordsList />);

    // Mock the dropdown toggle
    const dropdownElement = document.createElement('div');
    dropdownElement.classList.add('hidden');
    mockGetElementById.mockReturnValue(dropdownElement);

    // Click the "Manage Access" button
    fireEvent.click(screen.getByText('Manage Access ▼'));

    // Click the "Remove Test Record 1" button
    fireEvent.click(screen.getByText('Remove Test Record 1'));

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        deleteSharedPasswordRecordRequest({
          email: 'user1@example.com',
          password_record_id: 1
        })
      );
    });
  });

  it('handles revoking all access for a user', async () => {
    const { store , rerender} = renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: mockSharedRecords,
          sharedWithMe: [],
          isLoading: false,
          error: null
        }
      }
    });

    act(() => {
      store.dispatch(fetchSharedByMeSuccess(mockSharedRecords));
    });

    rerender(<SharedRecordsList />);

    // Mock the dropdown toggle
    const dropdownElement = document.createElement('div');
    dropdownElement.classList.add('hidden');
    mockGetElementById.mockReturnValue(dropdownElement);

    // Click the "Manage Access" button
    fireEvent.click(screen.getByText('Manage Access ▼'));

    // Click the "Revoke All Access" button
    fireEvent.click(screen.getByText('Revoke All Access'));

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        deleteSharedPasswordRecordRequest({
          email: 'user1@example.com',
          password_record_id: 1
        })
      );
      expect(store.getActions()).toContainEqual(
        deleteSharedPasswordRecordRequest({
          email: 'user1@example.com',
          password_record_id: 2
        })
      );
    });
  });
}); 