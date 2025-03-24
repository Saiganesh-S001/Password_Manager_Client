
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { SharedWithMeList } from '../../../components/shared_password_records/SharedWithMeList';
import { fetchRecordsRequest, fetchRecordsSuccess } from '../../../store/slices/passwordRecordsSlice';

// Mock the router navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock fetch API to prevent actual network requests
jest.mock('../../../client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

describe('SharedWithMeList', () => {
  const mockSharedRecords = [
    {
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
    {
      id: 2,
      title: 'Test Record 2',
      username: 'testuser2',
      password: 'testpass2',
      url: 'https://test2.com',
      user: {
        id: 2,
        email: 'another@example.com',
        display_name: 'Another Owner'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches fetchRecordsRequest on mount', () => {
    const { store } = renderWithProviders(<SharedWithMeList />);

    expect(store.getActions()).toContainEqual(fetchRecordsRequest({}));
  });

  it('displays empty state message when there are no shared records', () => {
    // Create a mock store that has an empty array of shared records
    const { store, rerender } = renderWithProviders(<SharedWithMeList />, {
      preloadedState: {
        passwordRecords: {
          records: [],
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Dispatch success action with empty shared records
    act(() => {
      store.dispatch(fetchRecordsSuccess({
        owner_records: [],
        shared_records: []
      }));
    });

    rerender(<SharedWithMeList />);

    expect(screen.getByText('No shared records found.')).toBeInTheDocument();
  });

  it('displays shared records when available', () => {
    // Create a mock store with shared records
    const { store, rerender } = renderWithProviders(<SharedWithMeList />, {
      preloadedState: {
        passwordRecords: {
          records: [],
          sharedRecords: mockSharedRecords,
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Dispatch success action with mock shared records
    act(() => {
      store.dispatch(fetchRecordsSuccess({
        owner_records: [],
        shared_records: mockSharedRecords
      }));
    });

    rerender(<SharedWithMeList />);

    // Check that record titles are displayed
    expect(screen.getByText('Test Record 1')).toBeInTheDocument();
    expect(screen.getByText('Test Record 2')).toBeInTheDocument();
    
    // Check that URLs are displayed
    expect(screen.getByText('https://test1.com')).toBeInTheDocument();
    expect(screen.getByText('https://test2.com')).toBeInTheDocument();
    
    // Check that View buttons are displayed
    const viewButtons = screen.getAllByText('View');
    expect(viewButtons).toHaveLength(2);
  });

  it('navigates to the record details when View is clicked', () => {
    // Create a mock store with shared records
    const { store, rerender } = renderWithProviders(<SharedWithMeList />, {
      preloadedState: {
        passwordRecords: {
          records: [],
          sharedRecords: mockSharedRecords,
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Dispatch success action with mock shared records
    act(() => {
      store.dispatch(fetchRecordsSuccess({
        owner_records: [],
        shared_records: mockSharedRecords
      }));
    });

    rerender(<SharedWithMeList />);

    // Click the View button for the first record
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    // Check that navigation was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith('/passwords/1');
  });

  it('navigates to the record details when title is clicked', () => {
    // Create a mock store with shared records
    const { store, rerender } = renderWithProviders(<SharedWithMeList />, {
      preloadedState: {
        passwordRecords: {
          records: [],
          sharedRecords: mockSharedRecords,
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Dispatch success action with mock shared records
    act(() => {
      store.dispatch(fetchRecordsSuccess({
        owner_records: [],
        shared_records: mockSharedRecords
      }));
    });

    rerender(<SharedWithMeList />);

    // Click the title of the second record
    fireEvent.click(screen.getByText('Test Record 2'));

    // Check that navigation was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith('/passwords/2');
  });

  it('opens URL in new tab when URL link is clicked', () => {
    // Create a mock store with shared records
    const { store, rerender } = renderWithProviders(<SharedWithMeList />, {
      preloadedState: {
        passwordRecords: {
          records: [],
          sharedRecords: mockSharedRecords,
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Dispatch success action with mock shared records
    act(() => {
      store.dispatch(fetchRecordsSuccess({
        owner_records: [],
        shared_records: mockSharedRecords
      }));
    });

    rerender(<SharedWithMeList />);

    // Check that the URL has the correct attributes
    const urlLink = screen.getByText('https://test1.com');
    expect(urlLink).toHaveAttribute('href', 'https://test1.com');
    expect(urlLink).toHaveAttribute('target', '_blank');
    expect(urlLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
}); 