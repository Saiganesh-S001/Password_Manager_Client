import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { SharedWithMeList } from '../../../components/shared_password_records/SharedWithMeList';
import { fetchRecordsRequest } from '../../../store/slices/passwordRecordsSlice';

describe('SharedWithMeList', () => {
  const mockSharedRecords = [
    {
      id: 1,
      title: 'Shared Record 1',
      url: 'https://test1.com',
      user: {
        id: 1,
        email: 'test@example.com',
        display_name: 'Test User',
      },
    },
    {
      id: 2,
      title: 'Shared Record 2',
      url: 'https://test2.com',
      user: {
        id: 2,
        email: 'test2@example.com',
        display_name: 'Test User 2',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches shared records on mount', () => {
    const { store } = renderWithProviders(<SharedWithMeList />);
    expect(store.getActions()).toContainEqual(fetchRecordsRequest({}));
  });

  it('displays shared records', () => {
    renderWithProviders(<SharedWithMeList />, {
      preloadedState: {
        passwordRecords: {
          records: [],
          sharedRecords: mockSharedRecords,
          currentRecord: null,
          isLoading: false,
          error: null,
        },
      },
    });

    mockSharedRecords.forEach(record => {
      expect(screen.getByText(record.title)).toBeInTheDocument();
      expect(screen.getByText(record.url)).toBeInTheDocument();
    });
  });

  it('handles view record navigation', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    renderWithProviders(<SharedWithMeList />, {
      preloadedState: {
        passwordRecords: {
          records: [],
          sharedRecords: mockSharedRecords,
          currentRecord: null,
          isLoading: false,
          error: null,
        },
      },
    });

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(`/passwords/${mockSharedRecords[0].id}`);
  });

  it('displays empty state message when no shared records', () => {
    renderWithProviders(<SharedWithMeList />, {
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

    expect(screen.getByText('No shared records found.')).toBeInTheDocument();
  });

  it('renders record URLs as clickable links', () => {
    renderWithProviders(<SharedWithMeList />, {
      preloadedState: {
        passwordRecords: {
          records: [],
          sharedRecords: mockSharedRecords,
          currentRecord: null,
          isLoading: false,
          error: null,
        },
      },
    });

    mockSharedRecords.forEach(record => {
      const link = screen.getByText(record.url);
      expect(link).toHaveAttribute('href', record.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
}); 