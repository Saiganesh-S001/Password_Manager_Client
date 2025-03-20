import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import EditPasswordRecord from '../../../components/password_records/EditPasswordRecord';
import { fetchRecordRequest, updateRecordRequest } from '../../../store/slices/passwordRecordsSlice';
import { toast } from 'react-toastify';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('EditPasswordRecord', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches record on mount', () => {
    const { store } = renderWithProviders(<EditPasswordRecord />);
    expect(store.getActions()).toContainEqual(fetchRecordRequest(1));
  });

  it('populates form with current record data', () => {
    renderWithProviders(<EditPasswordRecord />, {
      preloadedState: {
        passwordRecords: {
          currentRecord: mockRecord,
          records: [],
          sharedRecords: [],
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByLabelText(/title/i)).toHaveValue(mockRecord.title);
    expect(screen.getByLabelText(/username/i)).toHaveValue(mockRecord.username);
    expect(screen.getByLabelText(/password/i)).toHaveValue(mockRecord.password);
    expect(screen.getByLabelText(/url/i)).toHaveValue(mockRecord.url);
  });

  it('handles form submission correctly', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    const { store } = renderWithProviders(<EditPasswordRecord />, {
      preloadedState: {
        passwordRecords: {
          currentRecord: mockRecord,
          records: [],
          sharedRecords: [],
          isLoading: false,
          error: null,
        },
      },
    });

    const updatedTitle = 'Updated Title';
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: updatedTitle },
    });

    fireEvent.submit(screen.getByRole('button', { name: /update password record/i }));

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        updateRecordRequest({
          ...mockRecord,
          title: updatedTitle,
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Password record updated successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/passwords');
    });
  });

  it('shows error toast when update fails', async () => {
    renderWithProviders(<EditPasswordRecord />, {
      preloadedState: {
        passwordRecords: {
          currentRecord: mockRecord,
          records: [],
          sharedRecords: [],
          isLoading: false,
          error: 'Update failed',
        },
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: /update password record/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Update failed');
    });
  });
}); 