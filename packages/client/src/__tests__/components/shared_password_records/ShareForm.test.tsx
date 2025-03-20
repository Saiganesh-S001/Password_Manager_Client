import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { ShareForm } from '../../../components/shared_password_records/ShareForm';
import { createSharedPasswordRecordRequest } from '../../../store/slices/sharedPasswordRecordsSlice';

describe('ShareForm', () => {
  const mockRecords = [
    { id: 1, title: 'Password 1' },
    { id: 2, title: 'Password 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with password record options', () => {
    renderWithProviders(<ShareForm />, {
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

    expect(screen.getByText('Share Access')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter user's email")).toBeInTheDocument();
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Share All')).toBeInTheDocument();
    mockRecords.forEach(record => {
      expect(screen.getByText(record.title)).toBeInTheDocument();
    });
  });

  it('validates required email field', async () => {
    renderWithProviders(<ShareForm />);

    fireEvent.submit(screen.getByRole('button', { name: /share access/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderWithProviders(<ShareForm />);

    const emailInput = screen.getByPlaceholderText("Enter user's email");
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.submit(screen.getByRole('button', { name: /share access/i }));

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });

  it('handles share all records submission', async () => {
    const { store } = renderWithProviders(<ShareForm />, {
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

    const emailInput = screen.getByPlaceholderText("Enter user's email");
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(screen.getByRole('button', { name: /share access/i }));

    expect(store.getActions()).toContainEqual(
      createSharedPasswordRecordRequest({
        email: 'test@example.com',
      })
    );
  });

  it('handles single record share submission', async () => {
    const { store } = renderWithProviders(<ShareForm />, {
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

    const emailInput = screen.getByPlaceholderText("Enter user's email");
    const select = screen.getByRole('combobox');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(select, { target: { value: '1' } });
    fireEvent.submit(screen.getByRole('button', { name: /share access/i }));

    expect(store.getActions()).toContainEqual(
      createSharedPasswordRecordRequest({
        email: 'test@example.com',
        password_record_id: 1,
      })
    );
  });

  it('resets form after submission', async () => {
    renderWithProviders(<ShareForm />, {
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

    const emailInput = screen.getByPlaceholderText("Enter user's email");
    const select = screen.getByRole('combobox');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(select, { target: { value: '1' } });
    fireEvent.submit(screen.getByRole('button', { name: /share access/i }));

    await waitFor(() => {
      expect(emailInput).toHaveValue('');
      expect(select).toHaveValue('');
    });
  });
}); 