import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { PasswordRecordList } from '../../../components/password_records/PasswordRecordList';
import { fetchRecordsRequest, deleteRecordRequest } from '../../../store/slices/passwordRecordsSlice';

describe('PasswordRecordList', () => {
  const mockRecords = [
    {
      id: 1,
      title: 'Test Record 1',
      username: 'testuser1',
      password: 'testpass1',
      url: 'https://test1.com',
      user: {
        id: 1,
        email: 'test@example.com',
        display_name: 'Test User',
      },
    },
    {
      id: 2,
      title: 'Test Record 2',
      username: 'testuser2',
      password: 'testpass2',
      url: 'https://test2.com',
      user: {
        id: 1,
        email: 'test@example.com',
        display_name: 'Test User',
      },
    },
  ];

  it('fetches records on mount', () => {
    const { store } = renderWithProviders(<PasswordRecordList />);
    expect(store.getActions()).toContainEqual(fetchRecordsRequest({}));
  });

  it('displays list of records', () => {
    renderWithProviders(<PasswordRecordList />, {
      preloadedState: {
        passwordRecords: {
          records: mockRecords,
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null,
        },
      },
    });

    mockRecords.forEach(record => {
      expect(screen.getByText(record.title)).toBeInTheDocument();
      expect(screen.getByText(record.url)).toBeInTheDocument();
    });
  });

  it('shows "no records" message when empty', () => {
    renderWithProviders(<PasswordRecordList />, {
      preloadedState: {
        passwordRecords: {
          records: [],
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText(/no own passwordrecords found/i)).toBeInTheDocument();
  });

  it('handles record deletion', () => {
    const { store } = renderWithProviders(<PasswordRecordList />, {
      preloadedState: {
        passwordRecords: {
          records: mockRecords,
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null,
        },
      },
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(store.getActions()).toContainEqual(deleteRecordRequest(mockRecords[0].id));
  });

  it('navigates to view record', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderWithProviders(<PasswordRecordList />, {
      preloadedState: {
        passwordRecords: {
          records: mockRecords,
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null,
        },
      },
    });

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(`/passwords/${mockRecords[0].id}`);
  });

  it('navigates to edit record', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderWithProviders(<PasswordRecordList />, {
      preloadedState: {
        passwordRecords: {
          records: mockRecords,
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null,
        },
      },
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(`/passwords/${mockRecords[0].id}/edit`);
  });
}); 