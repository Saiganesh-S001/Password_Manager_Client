import rootReducer from '../../store/rootReducer';
import { loginRequest, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { fetchRecordsRequest, fetchRecordsSuccess } from '../../store/slices/passwordRecordsSlice';
import { fetchSharedByMeRequest, fetchSharedByMeSuccess } from '../../store/slices/sharedPasswordRecordsSlice';

describe('rootReducer', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    display_name: 'Test User'
  };

  it('should handle initial state', () => {
    const initialState = rootReducer(undefined, { type: 'unknown' });
    
    expect(initialState).toEqual({
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
      passwordRecords: {
        records: [],
        sharedRecords: [],
        currentRecord: null,
        isLoading: false,
        error: null,
      },
      sharedPasswordRecords: {
        sharedWithMe: [],
        sharedByMe: [],
        isLoading: false,
        error: null,
      },
    });
  });

  describe('auth slice', () => {
    it('should handle loginRequest', () => {
      const initialState = rootReducer(undefined, { type: 'unknown' });
      const nextState = rootReducer(initialState, loginRequest({ 
        email: 'test@example.com', 
        password: 'password' 
      }));
      
      expect(nextState.auth.isLoading).toBe(true);
      expect(nextState.auth.error).toBe(null);
    });

    it('should handle loginSuccess', () => {
      const initialState = rootReducer(undefined, { type: 'unknown' });
      const nextState = rootReducer(initialState, loginSuccess({ 
        user: mockUser,
        token: 'token123'
      }));
      
      expect(nextState.auth.isLoading).toBe(false);
      expect(nextState.auth.isAuthenticated).toBe(true);
      expect(nextState.auth.user).toEqual(mockUser);
      expect(nextState.auth.error).toBe(null);
    });

    it('should handle loginFailure', () => {
      const initialState = rootReducer(undefined, { type: 'unknown' });
      const nextState = rootReducer(initialState, loginFailure('Invalid credentials'));
      
      expect(nextState.auth.isLoading).toBe(false);
      expect(nextState.auth.error).toBe('Invalid credentials');
    });
  });

  describe('passwordRecords slice', () => {
    const mockRecords = [
      { id: 1, title: 'Test', username: 'test', password: 'test', url: 'test.com', user: mockUser }
    ];

    it('should handle fetchRecordsRequest', () => {
      const initialState = rootReducer(undefined, { type: 'unknown' });
      const nextState = rootReducer(initialState, fetchRecordsRequest({}));
      
      expect(nextState.passwordRecords.isLoading).toBe(true);
      expect(nextState.passwordRecords.error).toBe(null);
    });

    it('should handle fetchRecordsSuccess', () => {
      const initialState = rootReducer(undefined, { type: 'unknown' });
      const nextState = rootReducer(initialState, fetchRecordsSuccess({
        owner_records: mockRecords,
        shared_records: []
      }));
      
      expect(nextState.passwordRecords.records).toEqual(mockRecords);
      expect(nextState.passwordRecords.isLoading).toBe(false);
    });
  });

  describe('sharedPasswordRecords slice', () => {
    const mockSharedRecords = [
      { id: 1, password_record: { id: 1, title: 'Test', username: 'test', password: 'test', url: 'test.com', user: mockUser }, owner: mockUser, collaborator: mockUser }
    ];

    it('should handle fetchSharedByMeRequest', () => {
      const initialState = rootReducer(undefined, { type: 'unknown' });
      const nextState = rootReducer(initialState, fetchSharedByMeRequest());
      
      expect(nextState.sharedPasswordRecords.isLoading).toBe(true);
      expect(nextState.sharedPasswordRecords.error).toBe(null);
    });

    it('should handle fetchSharedByMeSuccess', () => {
      const initialState = rootReducer(undefined, { type: 'unknown' });
      const nextState = rootReducer(initialState, fetchSharedByMeSuccess(mockSharedRecords));
      
      expect(nextState.sharedPasswordRecords.sharedByMe).toEqual(mockSharedRecords);
      expect(nextState.sharedPasswordRecords.isLoading).toBe(false);
    });
  });

  it('should maintain independent state slices', () => {
    const initialState = rootReducer(undefined, { type: 'unknown' });
    const nextState = rootReducer(initialState, loginRequest({ 
      email: 'test@example.com', 
      password: 'password' 
    }));
    
    expect(nextState.auth.isLoading).toBe(true);
    expect(nextState.passwordRecords.isLoading).toBe(false);
    expect(nextState.sharedPasswordRecords.isLoading).toBe(false);
  });
}); 