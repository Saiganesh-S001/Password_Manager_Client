import authReducer, {
    loginRequest,
    loginSuccess,
    loginFailure,
    logoutRequest,
    logoutSuccess,
    logoutFailure,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFailure,
  } from '../../store/slices/authSlice';
  
describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    display_name: 'Test User',
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('login', () => {
    it('should handle loginRequest', () => {
      const actual = authReducer(initialState, loginRequest({ email: 'test@example.com', password: 'password' }));
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle loginSuccess', () => {
      const actual = authReducer(initialState, loginSuccess({ user: mockUser, token: 'token' }));
      expect(actual.isLoading).toBe(false);
      expect(actual.isAuthenticated).toBe(true);
      expect(actual.user).toEqual(mockUser);
    });

    it('should handle loginFailure', () => {
      const error = 'Invalid credentials';
      const actual = authReducer(initialState, loginFailure(error));
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe(error);
    });
  });

  describe('logout', () => {
    const authenticatedState = {
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    it('should handle logoutRequest', () => {
      const actual = authReducer(authenticatedState, logoutRequest());
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle logoutSuccess', () => {
      const actual = authReducer(authenticatedState, logoutSuccess());
      expect(actual.user).toBeNull();
      expect(actual.isAuthenticated).toBe(false);
      expect(actual.isLoading).toBe(false);
    });

    it('should handle logoutFailure', () => {
      const error = 'Logout failed';
      const actual = authReducer(authenticatedState, logoutFailure(error));
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe(error);
    });
  });

  describe('updateProfile', () => {
    const authenticatedState = {
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    it('should handle updateProfileRequest', () => {
      const actual = authReducer(authenticatedState, updateProfileRequest({
        display_name: 'Updated User',
        email: 'updated@example.com',
        current_password: 'password',
        password: 'newpassword',
        password_confirmation: 'newpassword'
      }));
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle updateProfileSuccess', () => {
      const updatedUser = { ...mockUser, display_name: 'Updated User' };
      const actual = authReducer(authenticatedState, updateProfileSuccess(updatedUser));
      expect(actual.isLoading).toBe(false);
      expect(actual.user).toEqual(updatedUser);
    });

    it('should handle updateProfileFailure', () => {
      const error = 'Update failed';
      const actual = authReducer(authenticatedState, updateProfileFailure(error));
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe(error);
    });
  });
});