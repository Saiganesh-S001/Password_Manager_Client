import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import EditPasswordRecord from '../../../components/password_records/EditPasswordRecord';
import { fetchRecordRequest, updateRecordRequest } from '../../../store/slices/passwordRecordsSlice';
import { toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
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
    const { store } = renderWithProviders(<BrowserRouter><EditPasswordRecord /></BrowserRouter>);
    expect(store.getActions()).toContainEqual(fetchRecordRequest(1));
  });

  it('populates form with current record data', () => {
    renderWithProviders(<BrowserRouter><EditPasswordRecord /></BrowserRouter>, {
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

    const { store } = renderWithProviders(<BrowserRouter><EditPasswordRecord /></BrowserRouter>, {
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
    // Create a custom implementation of toast.error to verify it's called
    const errorToastSpy = jest.spyOn(toast, 'error');
    
    // First render with no error
    const { rerender } = renderWithProviders(<BrowserRouter><EditPasswordRecord /></BrowserRouter>, {
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
    
    // Then rerender with an error to trigger the useEffect
    rerender(
      <BrowserRouter><EditPasswordRecord /></BrowserRouter>
    );
    
    // Simulate a Redux state update with an error
    const result = renderWithProviders(<BrowserRouter><EditPasswordRecord /></BrowserRouter>, {
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
    
    rerender(
      <Provider store={result.store}>
        <BrowserRouter><EditPasswordRecord /></BrowserRouter>
      </Provider>
    );

    // Verify error toast was displayed by the useEffect
    expect(errorToastSpy).toHaveBeenCalledWith('Update failed');
  });
}); 