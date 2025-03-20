import sharedPasswordRecordsReducer, {
    fetchSharedWithMeRequest,
    fetchSharedWithMeSuccess,
    fetchSharedWithMeFailure,
    fetchSharedByMeRequest,
    fetchSharedByMeSuccess,
    fetchSharedByMeFailure,
    createSharedPasswordRecordRequest,
    createSharedPasswordRecordSuccess,
    createSharedPasswordRecordFailure,
    deleteSharedPasswordRecordRequest,
    deleteSharedPasswordRecordSuccess,
    deleteSharedPasswordRecordFailure,
  } from '../../store/slices/sharedPasswordRecordsSlice';
  
  describe('sharedPasswordRecordsSlice', () => {
    const initialState = {
      sharedWithMe: [],
      sharedByMe: [],
      isLoading: false,
      error: null,
    };
  
    const mockSharedRecord = {
      id: 1,
      owner: {
        id: 1,
        email: 'test@example.com',
        display_name: 'Test User',
      },
      collaborator: {
        id: 2,
        email: 'test@example.com',
        display_name: 'Test User',
      },
      password_record: {
        id: 1,
        title: 'Shared Record',
        username: 'shareduser',
        password: 'sharedpass',
        url: 'https://shared.com',
        user: {
          id: 1,
          email: 'test@example.com',
          display_name: 'Test User',
        },
      },
    };
  
    it('should handle initial state', () => {
      expect(sharedPasswordRecordsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    describe('fetchSharedWithMe', () => {
      it('should handle fetchSharedWithMeRequest', () => {
        const actual = sharedPasswordRecordsReducer(initialState, fetchSharedWithMeRequest());
        expect(actual.isLoading).toBe(true);
        expect(actual.error).toBeNull();
      });
  
      it('should handle fetchSharedWithMeSuccess', () => {
        const actual = sharedPasswordRecordsReducer(initialState, fetchSharedWithMeSuccess([mockSharedRecord]));
        expect(actual.sharedWithMe).toEqual([mockSharedRecord]);
        expect(actual.isLoading).toBe(false);
      });
  
      it('should handle fetchSharedWithMeFailure', () => {
        const error = 'Fetch failed';
        const actual = sharedPasswordRecordsReducer(initialState, fetchSharedWithMeFailure(error));
        expect(actual.error).toBe(error);
        expect(actual.isLoading).toBe(false);
      });
    });
  
    describe('fetchSharedByMe', () => {
      it('should handle fetchSharedByMeRequest', () => {
        const actual = sharedPasswordRecordsReducer(initialState, fetchSharedByMeRequest());
        expect(actual.isLoading).toBe(true);
        expect(actual.error).toBeNull();
      });
  
      it('should handle fetchSharedByMeSuccess', () => {
        const actual = sharedPasswordRecordsReducer(initialState, fetchSharedByMeSuccess([mockSharedRecord]));
        expect(actual.sharedByMe).toEqual([mockSharedRecord]);
        expect(actual.isLoading).toBe(false);
      });
  
      it('should handle fetchSharedByMeFailure', () => {
        const error = 'Fetch failed';
        const actual = sharedPasswordRecordsReducer(initialState, fetchSharedByMeFailure(error));
        expect(actual.error).toBe(error);
        expect(actual.isLoading).toBe(false);
      });
    });
  
    describe('createSharedPasswordRecord', () => {
      it('should handle createSharedPasswordRecordRequest', () => {
        const actual = sharedPasswordRecordsReducer(initialState, createSharedPasswordRecordRequest({
          password_record_id: 1,
          email: 'test@example.com',
        }));
        expect(actual.isLoading).toBe(true);
        expect(actual.error).toBeNull();
      });
  
      it('should handle createSharedPasswordRecordSuccess', () => {
        const actual = sharedPasswordRecordsReducer(initialState, createSharedPasswordRecordSuccess(mockSharedRecord));
        expect(actual.sharedByMe).toEqual([mockSharedRecord]);
        expect(actual.isLoading).toBe(false);
      });
  
      it('should handle createSharedPasswordRecordFailure', () => {
        const error = 'Create failed';
        const actual = sharedPasswordRecordsReducer(initialState, createSharedPasswordRecordFailure(error));
        expect(actual.error).toBe(error);
        expect(actual.isLoading).toBe(false);
      });
    });
  
    describe('deleteSharedPasswordRecord', () => {
      const stateWithSharedRecords = {
        ...initialState,
        sharedByMe: [mockSharedRecord],
      };
  
      it('should handle deleteSharedPasswordRecordRequest', () => {
        const actual = sharedPasswordRecordsReducer(stateWithSharedRecords, deleteSharedPasswordRecordRequest({
          email: 'test@example.com',
          password_record_id: 1,
        }));
        expect(actual.isLoading).toBe(true);
        expect(actual.error).toBeNull();
      });
  
      it('should handle deleteSharedPasswordRecordSuccess', () => {
        const actual = sharedPasswordRecordsReducer(stateWithSharedRecords, deleteSharedPasswordRecordSuccess(1));
        expect(actual.sharedByMe).toEqual([]);
        expect(actual.isLoading).toBe(false);
      });
  
      it('should handle deleteSharedPasswordRecordFailure', () => {
        const error = 'Delete failed';
        const actual = sharedPasswordRecordsReducer(stateWithSharedRecords, deleteSharedPasswordRecordFailure(error));
        expect(actual.error).toBe(error);
        expect(actual.isLoading).toBe(false);
      });
    });
  });