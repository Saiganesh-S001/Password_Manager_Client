import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { PasswordRecordForm } from '../../../components/password_records/PasswordRecordForm';
import { createRecordRequest, updateRecordRequest } from '../../../store/slices/passwordRecordsSlice';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('PasswordRecordForm', () => {
  const mockRecord = {
    id: 1,
    title: 'Test Record',
    username: 'testuser',
    password: 'testpass',
    url: 'https://test.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create form by default', () => {
    renderWithProviders(<PasswordRecordForm />);

    expect(screen.getByText('Create Password Record')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/username/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
    expect(screen.getByLabelText(/url/i)).toHaveValue('');
  });

  it('renders edit form with initial data', () => {
    renderWithProviders(
      <PasswordRecordForm initialData={mockRecord} isEditMode={true} />
    );

    expect(screen.getByText('Edit Password Record')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue(mockRecord.title);
    expect(screen.getByLabelText(/username/i)).toHaveValue(mockRecord.username);
    expect(screen.getByLabelText(/password/i)).toHaveValue(mockRecord.password);
    expect(screen.getByLabelText(/url/i)).toHaveValue(mockRecord.url);
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<PasswordRecordForm />);

    fireEvent.submit(screen.getByRole('button', { name: /create password record/i }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(await screen.findByText('URL is required')).toBeInTheDocument();
  });

  it('handles create submission correctly', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    const { store } = renderWithProviders(<PasswordRecordForm />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: mockRecord.title },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: mockRecord.username },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: mockRecord.password },
    });
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: mockRecord.url },
    });

    fireEvent.submit(screen.getByRole('button', { name: /create password record/i }));

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        createRecordRequest({
          title: mockRecord.title,
          username: mockRecord.username,
          password: mockRecord.password,
          url: mockRecord.url,
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Password record created successfully');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 1500 });
  });

  it('handles update submission correctly', async () => {
    const { store } = renderWithProviders(
      <PasswordRecordForm initialData={mockRecord} isEditMode={true} />
    );

    const updatedTitle = 'Updated Title';
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: updatedTitle },
    });

    fireEvent.submit(screen.getByRole('button', { name: /update password record/i }));

    expect(store.getActions()).toContainEqual(
      updateRecordRequest({
        ...mockRecord,
        title: updatedTitle,
      })
    );
  });
}); 