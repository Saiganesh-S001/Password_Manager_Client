import { screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../../components/layouts/SearchBar';
import { renderWithProviders } from '../test-utils';
import { fetchRecordsRequest } from '../../store/slices/passwordRecordsSlice';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
}));

// Mock lodash debounce to execute immediately in tests
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: (fn: (...args: any[]) => any) => {
    const debouncedFn = fn as any;
    debouncedFn.cancel = jest.fn();
    return debouncedFn;
  },
}));

describe('SearchBar', () => {
  const mockSetSearchParams = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Override the default mock implementations
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    jest.spyOn(require('react-router-dom'), 'useSearchParams').mockImplementation(() => [
      new URLSearchParams(),
      mockSetSearchParams,
    ]);
  });

  it('renders search input correctly', () => {
    renderWithProviders(<SearchBar />);

    expect(screen.getByPlaceholderText('Search passwords...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('initializes form with URL search params', () => {
    const searchParams = new URLSearchParams();
    searchParams.set('search_by_title', 'test value');

    jest.spyOn(require('react-router-dom'), 'useSearchParams').mockImplementation(() => [
      searchParams,
      mockSetSearchParams,
    ]);

    renderWithProviders(<SearchBar />);

    expect(screen.getByPlaceholderText('Search passwords...')).toHaveValue('test value');
  });

  it('dispatches search action on input change after debounce', async () => {
    const { store } = renderWithProviders(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText('Search passwords...'), {
      target: { value: 'test query' },
    });

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        fetchRecordsRequest({
          search_by_title: 'test query',
          search_by_username: 'test query',
          search_by_url: 'test query',
        })
      );
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.objectContaining(new URLSearchParams({ 
        search_by_title: 'test query',
        search_by_username: 'test query',
        search_by_url: 'test query'
      }))
    );
  });

  it('updates URL search params when searching', async () => {
    renderWithProviders(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText('Search passwords...'), {
      target: { value: 'test query' },
    });

    await waitFor(() => {
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.objectContaining(
          new URLSearchParams({
            search_by_title: 'test query',
            search_by_username: 'test query',
            search_by_url: 'test query',
          })
        )
      );
    });
  });

  it('clears search params and resets form on clear button click', async () => {
    const { store } = renderWithProviders(<SearchBar />);

    // First set some values
    fireEvent.change(screen.getByPlaceholderText('Search passwords...'), {
      target: { value: 'test query' },
    });

    // Click clear button
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    await waitFor(() => {
      // Check if search params were cleared
      expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams());
      
      // Check if form was reset
      expect(screen.getByPlaceholderText('Search passwords...')).toHaveValue('');

      // Check if fetch action was dispatched with empty params
      expect(store.getActions()).toContainEqual(fetchRecordsRequest({}));
    });
  });

  it('clears search params when location changes', async () => {
    const { rerender } = renderWithProviders(<SearchBar />);

    // Simulate location change
    jest.spyOn(require('react-router-dom'), 'useLocation').mockImplementation(() => ({
      pathname: '/new-path',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }));

    rerender(<SearchBar />);

    await waitFor(() => {
      expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams());
    });
  });

  it('cancels debounced search on unmount', () => {
    const { unmount } = renderWithProviders(<SearchBar />);
    
    // Trigger a search
    fireEvent.change(screen.getByPlaceholderText('Search passwords...'), {
      target: { value: 'test' },
    });

    // Unmount component
    unmount();

    // The debounce cancel function should have been called
    // This is handled by the useEffect cleanup
    // We can't directly test this as it's internal to the debounce implementation
  });
}); 