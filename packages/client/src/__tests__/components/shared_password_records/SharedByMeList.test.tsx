import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { SharedRecordsList } from '../../../components/shared_password_records/SharedByMeList';
import { fetchSharedByMeRequest, deleteSharedPasswordRecordRequest } from '../../../store/slices/sharedPasswordRecordsSlice';

describe('SharedRecordsList', () => {
  const mockSharedRecords = [
    {
      id: 1,
      password_record: {
        id: 101,
        title: 'Test Record 1',
      },
      collaborator: {
        id: 201,
        email: 'user1@example.com',
      },
    },
    {
      id: 2,
      password_record: {
        id: 102,
        title: 'Test Record 2',
      },
      collaborator: {
        id: 201,
        email: 'user1@example.com',
      },
    },
    {
      id: 3,
      password_record: {
        id: 103,
        title: 'Test Record 3',
      },
      collaborator: {
        id: 202,
        email: 'user2@example.com',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches shared records on mount', () => {
    const { store } = renderWithProviders(<SharedRecordsList />);
    expect(store.getActions()).toContainEqual(fetchSharedByMeRequest());
  });

  it('displays loading state', () => {
    renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: [],
          sharedWithMe: [],
          isLoading: true,
          error: null,
        },
      },
    });

    expect(screen.getByText('Loading shared records...')).toBeInTheDocument();
  });

  it('displays grouped shared records by user', () => {
    renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: mockSharedRecords,
          sharedWithMe: [],
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Test Record 1.*Test Record 2/)).toBeInTheDocument();
    expect(screen.getByText(/Test Record 3/)).toBeInTheDocument();
  });

  it('handles remove access for single record', () => {
    const { store } = renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: mockSharedRecords,
          sharedWithMe: [],
          isLoading: false,
          error: null,
        },
      },
    });

    // Open dropdown
    fireEvent.click(screen.getAllByText('Manage Access')[0]);
    // Click remove access for first record
    fireEvent.click(screen.getByText(/Remove Test Record 1/));

    expect(store.getActions()).toContainEqual(
      deleteSharedPasswordRecordRequest({
        email: 'user1@example.com',
        password_record_id: 101,
      })
    );
  });

  it('handles revoke all access for user', () => {
    const { store } = renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: mockSharedRecords,
          sharedWithMe: [],
          isLoading: false,
          error: null,
        },
      },
    });

    // Open dropdown
    fireEvent.click(screen.getAllByText('Manage Access')[0]);
    // Click revoke all access
    fireEvent.click(screen.getAllByText('Revoke All Access')[0]);

    // Should dispatch delete request for all records shared with the user
    expect(store.getActions()).toContainEqual(
      deleteSharedPasswordRecordRequest({
        email: 'user1@example.com',
        password_record_id: 101,
      })
    );
    expect(store.getActions()).toContainEqual(
      deleteSharedPasswordRecordRequest({
        email: 'user1@example.com',
        password_record_id: 102,
      })
    );
  });

  it('displays empty state message when no shared records', () => {
    renderWithProviders(<SharedRecordsList />, {
      preloadedState: {
        sharedPasswordRecords: {
          sharedByMe: [],
          sharedWithMe: [],
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('No users have been granted access yet.')).toBeInTheDocument();
  });
}); 