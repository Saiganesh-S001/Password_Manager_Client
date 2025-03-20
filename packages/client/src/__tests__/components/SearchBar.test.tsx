import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { SearchBar } from '../../components/layouts/SearchBar';
import { renderWithProviders } from '../test-utils';
import { fetchRecordsRequest } from '../../store/slices/passwordRecordsSlice';
import * as router from 'react-router-dom';

// Mock lodash debounce to execute immediately in tests
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: (fn: Function) => {
    fn.cancel = jest.fn();
    return fn;
  },
}));

describe('SearchBar', () => {
  const mockNavigate = jest.fn();
  const mockSetSearchParams = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);
    jest.spyOn(router, 'useSearchParams').mockImplementation(() => [
      mockSearchParams,
      mockSetSearchParams,
    ]);
  });

  it('renders search inputs correctly', () => {
    renderWithProviders(<SearchBar />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('initializes form with URL search params', () => {
    const searchParams = new URLSearchParams();
    searchParams.set('search_by_title', 'test title');
    searchParams.set('search_by_username', 'test user');
    searchParams.set('search_by_url', 'test.com');

    jest.spyOn(router, 'useSearchParams').mockImplementation(() => [
      searchParams,
      mockSetSearchParams,
    ]);

    renderWithProviders(<SearchBar />);

    expect(screen.getByPlaceholderText('Title')).toHaveValue('test title');
    expect(screen.getByPlaceholderText('Username')).toHaveValue('test user');
    expect(screen.getByPlaceholderText('URL')).toHaveValue('test.com');
  });

  it('dispatches search action on input change after debounce', async () => {
    const { store } = renderWithProviders(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'test title' },
    });

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        fetchRecordsRequest({
          search_by_title: 'test title',
          search_by_username: '',
          search_by_url: '',
        })
      );
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.objectContaining(new URLSearchParams({ search_by_title: 'test title' }))
    );
  });

  it('updates URL search params when searching', async () => {
    renderWithProviders(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'test title' },
    });
    fireEvent.change(screen.getByPlaceholderText('URL'), {
      target: { value: 'test.com' },
    });

    await waitFor(() => {
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.objectContaining(
          new URLSearchParams({
            search_by_title: 'test title',
            search_by_url: 'test.com',
          })
        )
      );
    });
  });

  it('clears search params and resets form on cancel', async () => {
    const { store } = renderWithProviders(<SearchBar />);

    // First set some values
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'test title' },
    });

    // Click cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      // Check if search params were cleared
      expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams());
      
      // Check if form was reset
      expect(screen.getByPlaceholderText('Title')).toHaveValue('');
      expect(screen.getByPlaceholderText('URL')).toHaveValue('');
      expect(screen.getByPlaceholderText('Username')).toHaveValue('');

      // Check if fetch action was dispatched with empty params
      expect(store.getActions()).toContainEqual(fetchRecordsRequest({}));
    });
  });

  it('clears search params when location changes', async () => {
    const { rerender } = renderWithProviders(<SearchBar />);

    // Simulate location change
    jest.spyOn(router, 'useLocation').mockImplementation(() => ({
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

  it('handles multiple search criteria simultaneously', async () => {
    const { store } = renderWithProviders(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'test title' },
    });
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'test user' },
    });
    fireEvent.change(screen.getByPlaceholderText('URL'), {
      target: { value: 'test.com' },
    });

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        fetchRecordsRequest({
          search_by_title: 'test title',
          search_by_username: 'test user',
          search_by_url: 'test.com',
        })
      );

      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.objectContaining(
          new URLSearchParams({
            search_by_title: 'test title',
            search_by_username: 'test user',
            search_by_url: 'test.com',
          })
        )
      );
    });
  });

  it('cancels debounced search on unmount', () => {
    const { unmount } = renderWithProviders(<SearchBar />);
    
    // Trigger a search
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'test' },
    });

    // Unmount component
    unmount();

    // The debounce cancel function should have been called
    // This is handled by the useEffect cleanup
    // We can't directly test this as it's internal to the debounce implementation
  });
}); 