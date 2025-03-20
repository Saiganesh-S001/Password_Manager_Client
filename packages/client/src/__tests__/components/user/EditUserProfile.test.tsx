import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { EditProfile } from '../../../components/user/EditUserProfile';
import { updateProfileRequest, deleteAccountRequest } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock window.confirm
const mockConfirm = jest.fn(() => true);
window.confirm = mockConfirm;

describe('EditProfile', () => {
  const mockUser = {
    id: 1,
    display_name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with user data', () => {
    renderWithProviders(<EditProfile />, {
      preloadedState: {
        auth: {
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    expect(screen.getByLabelText(/display name/i)).toHaveValue(mockUser.display_name);
    expect(screen.getByLabelText(/email/i)).toHaveValue(mockUser.email);
  });

  it('validates required fields', async () => {
    renderWithProviders(<EditProfile />);

    fireEvent.submit(screen.getByRole('button', { name: /update/i }));

    expect(await screen.findByText('Display name is required')).toBeInTheDocument();
    expect(await screen.findByText('Current password is required')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderWithProviders(<EditProfile />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /update/i }));

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });

  it('validates password confirmation match', async () => {
    renderWithProviders(<EditProfile />);

    fireEvent.input(screen.getByLabelText(/^password$/i), {
      target: { value: 'newpassword' },
    });
    fireEvent.input(screen.getByLabelText(/password confirmation/i), {
      target: { value: 'differentpassword' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /update/i }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('handles profile update submission', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockImplementation(() => mockNavigate);

    const { store } = renderWithProviders(<EditProfile />, {
      preloadedState: {
        auth: {
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    const updatedData = {
      display_name: 'Updated Name',
      email: 'updated@example.com',
      current_password: 'currentpass',
    };

    fireEvent.input(screen.getByLabelText(/display name/i), {
      target: { value: updatedData.display_name },
    });
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: updatedData.email },
    });
    fireEvent.input(screen.getByLabelText(/current password/i), {
      target: { value: updatedData.current_password },
    });

    fireEvent.submit(screen.getByRole('button', { name: /update/i }));

    expect(store.getActions()).toContainEqual(updateProfileRequest(updatedData));
    expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/passwords');
  });

  it('shows error toast when update fails', () => {
    renderWithProviders(<EditProfile />, {
      preloadedState: {
        auth: {
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: 'Update failed',
        },
      },
    });

    fireEvent.submit(screen.getByRole('button', { name: /update/i }));

    expect(toast.error).toHaveBeenCalledWith('Update failed');
  });

  it('handles account deletion with confirmation', () => {
    const { store } = renderWithProviders(<EditProfile />);

    fireEvent.click(screen.getByText(/cancel my account/i));

    expect(mockConfirm).toHaveBeenCalledWith(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    expect(store.getActions()).toContainEqual(deleteAccountRequest());
  });

  it('shows loading state during update', () => {
    renderWithProviders(<EditProfile />, {
      preloadedState: {
        auth: {
          user: mockUser,
          isAuthenticated: true,
          isLoading: true,
          error: null,
        },
      },
    });

    expect(screen.getByRole('button', { name: /updating/i })).toBeDisabled();
  });
}); 