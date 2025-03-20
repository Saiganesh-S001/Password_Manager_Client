import rootReducer from '../../store/rootReducer';
import { authActions } from '../../store/slices/authSlice';
import { passwordRecordsActions } from '../../store/slices/passwordRecordsSlice';
import { sharedPasswordRecordsActions } from '../../store/slices/sharedPasswordRecordsSlice';

describe('rootReducer', () => {
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

  it('should handle auth actions', () => {
    const initialState = rootReducer(undefined, { type: 'unknown' });
    const nextState = rootReducer(initialState, authActions.loginRequest({ email: 'test@example.com', password: 'password' }));
    
    expect(nextState.auth.isLoading).toBe(true);
    expect(nextState.auth.error).toBe(null);
  });

  it('should handle password records actions', () => {
    const initialState = rootReducer(undefined, { type: 'unknown' });
    const nextState = rootReducer(initialState, passwordRecordsActions.fetchRecordsRequest({}));
    
    expect(nextState.passwordRecords.isLoading).toBe(true);
    expect(nextState.passwordRecords.error).toBe(null);
  });

  it('should handle shared password records actions', () => {
    const initialState = rootReducer(undefined, { type: 'unknown' });
    const nextState = rootReducer(initialState, sharedPasswordRecordsActions.fetchSharedByMeRequest());
    
    expect(nextState.sharedPasswordRecords.isLoading).toBe(true);
    expect(nextState.sharedPasswordRecords.error).toBe(null);
  });

  it('should maintain independent state slices', () => {
    const initialState = rootReducer(undefined, { type: 'unknown' });
    const nextState = rootReducer(initialState, authActions.loginRequest({ email: 'test@example.com', password: 'password' }));
    
    expect(nextState.auth.isLoading).toBe(true);
    expect(nextState.passwordRecords.isLoading).toBe(false);
    expect(nextState.sharedPasswordRecords.isLoading).toBe(false);
  });
}); 