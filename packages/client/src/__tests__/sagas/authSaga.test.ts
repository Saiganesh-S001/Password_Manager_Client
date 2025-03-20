import { expectSaga } from 'redux-saga-test-plan';

import {
  loginSaga,
  registerSaga,
  logoutSaga,
  updateProfileSaga,
  deleteAccountSaga,
} from '../../store/sagas/authSaga';
import apiClient from '../../client';

jest.mock('../../client');

beforeEach(() => {
  jest.clearAllMocks();
});

const mockPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
const mockPut = apiClient.put as jest.MockedFunction<typeof apiClient.put>;
const mockDelete = apiClient.delete as jest.MockedFunction<typeof apiClient.delete>;


import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  logoutFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  deleteAccountSuccess,
  deleteAccountFailure,
} from '../../store/slices/authSlice';

// Mock data setup
const mockUser = {
  id: 1,
  email: 'test@example.com',
  display_name: 'Test User',
};

const mockLoginResponse = {
  user: mockUser,
  token: 'test-token',
};

beforeEach(() => {
  Storage.prototype.getItem = jest.fn((key) => (key === 'token' ? 'test-token' : null));
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
});


// Test cases

describe('authSaga', () => {
  describe('loginSaga', () => {
    const loginCredentials = { email: 'saiganeshs902@gmail.com', password: '1234567' };

    it('handles successful login', () => {
      mockPost.mockResolvedValue({ data: mockLoginResponse });
      
      return expectSaga(loginSaga, loginRequest(loginCredentials))
          .put(loginSuccess(mockLoginResponse))
          .run();
    });

    it('handles login failure', () => {
      const error = new Error('Invalid credentials');
      mockPost.mockRejectedValue(error);
      return expectSaga(loginSaga, loginRequest(loginCredentials))
          .put(loginFailure(error.message))
          .run();
    });
  });

  describe('registerSaga', () => {
    const registerData = {
      email: 'test@example.com',
      password: 'password',
      password_confirmation: 'password',
      display_name: 'Test User',
    };

    it('handles successful registration', () => {
      mockPost.mockResolvedValue({ data: mockLoginResponse });
      return expectSaga(registerSaga, registerRequest(registerData))
          .put(registerSuccess(mockLoginResponse))
          .run();
    });

    it('handles registration failure', () => {
      const error = new Error('Email already taken');
      mockPost.mockRejectedValue(error);
      return expectSaga(registerSaga, registerRequest(registerData))
          .put(registerFailure(error.message))
          .run();
    });
  });

  describe('updateProfileSaga', () => {
    const updateData = {
      display_name: 'Updated User',
      email: 'updated@example.com',
      current_password: 'password',
      password: 'newpassword',
      password_confirmation: 'newpassword',
    };

    it('handles successful profile update', () => {
      const updatedUser = { ...mockUser, display_name: 'Updated User' };
      mockPut.mockResolvedValue({ data: { user: updatedUser } });
      return expectSaga(updateProfileSaga, updateProfileRequest(updateData))
          .put(updateProfileSuccess(updatedUser))
          .run();
    });

    it('handles profile update failure', () => {
      const error = new Error('Update failed');
      mockPut.mockRejectedValue(error);
      return expectSaga(updateProfileSaga, updateProfileRequest(updateData))
          .put(updateProfileFailure(error.message))
          .run();
    });
  });

  describe('logoutSaga', () => {
    it('handles successful logout', () => {
      mockPost.mockResolvedValue({ data: null });
      return expectSaga(logoutSaga)
          .put(logoutSuccess())
          .run();
    });

    it('handles logout failure', () => {
      const error = new Error('Logout failed');
      mockPost.mockRejectedValue(error);
      return expectSaga(logoutSaga)
          .put(logoutFailure(error.message))
          .run();
    });
  });

  describe('deleteAccountSaga', () => {
    it('handles successful account deletion', () => {
      mockDelete.mockResolvedValue({ data: null });
      return expectSaga(deleteAccountSaga)
          .put(deleteAccountSuccess())
          .run();
    });

    it('handles account deletion failure', () => {
      const error = new Error('Delete failed');
      mockDelete.mockRejectedValue(error);
      return expectSaga(deleteAccountSaga)
          .put(deleteAccountFailure(error.message))
          .run();
    });
  });
});
