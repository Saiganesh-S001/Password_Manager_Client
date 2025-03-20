import passwordRecordsReducer, {
  fetchRecordsRequest,
  fetchRecordsSuccess,
  fetchRecordsFailure,
  fetchRecordRequest,
  fetchRecordSuccess,
  fetchRecordFailure,
  createRecordRequest,
  createRecordSuccess,
  createRecordFailure,
  updateRecordRequest,
  updateRecordSuccess,
  updateRecordFailure,
  deleteRecordRequest,
  deleteRecordSuccess,
  deleteRecordFailure,
} from '../../store/slices/passwordRecordsSlice';

describe('passwordRecordsSlice', () => {
  const initialState = {
    records: [],
    sharedRecords: [],
    currentRecord: null,
    isLoading: false,
    error: null,
  };

  const mockRecord = {
    id: 1,
    title: 'Test Record',
    username: 'testuser',
    password: 'testpass',
    url: 'https://test.com',
    user: {
      id: 1,
      email: 'test@example.com',
      display_name: 'Test User',
    },
  };

  it('should handle initial state', () => {
    expect(passwordRecordsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchRecords', () => {
    it('should handle fetchRecordsRequest', () => {
      const actual = passwordRecordsReducer(initialState, fetchRecordsRequest({}));
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle fetchRecordsSuccess', () => {
      const payload = {
        owner_records: [mockRecord],
        shared_records: [],
      };
      const actual = passwordRecordsReducer(initialState, fetchRecordsSuccess(payload));
      expect(actual.records).toEqual([mockRecord]);
      expect(actual.sharedRecords).toEqual([]);
      expect(actual.isLoading).toBe(false);
    });

    it('should handle fetchRecordsFailure', () => {
      const error = 'Fetch failed';
      const actual = passwordRecordsReducer(initialState, fetchRecordsFailure(error));
      expect(actual.error).toBe(error);
      expect(actual.isLoading).toBe(false);
    });
  });

  describe('fetchRecord', () => {
    it('should handle fetchRecordRequest', () => {
      const actual = passwordRecordsReducer(initialState, fetchRecordRequest(1));
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle fetchRecordSuccess', () => {
      const actual = passwordRecordsReducer(initialState, fetchRecordSuccess(mockRecord));
      expect(actual.currentRecord).toEqual(mockRecord);
      expect(actual.isLoading).toBe(false);
    });

    it('should handle fetchRecordFailure', () => {
      const error = 'Fetch failed';
      const actual = passwordRecordsReducer(initialState, fetchRecordFailure(error));
      expect(actual.error).toBe(error);
      expect(actual.isLoading).toBe(false);
    });
  });

  describe('updateRecord', () => {
    const stateWithRecords = {
      ...initialState,
      records: [mockRecord],
    };

    it('should handle updateRecordRequest', () => {
      const actual = passwordRecordsReducer(stateWithRecords, updateRecordRequest({
        id: 1,
        title: 'Updated Record',
        username: 'updateduser',
        password: 'updatedpass',
        url: 'https://updated.com',
      }));
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle updateRecordSuccess', () => {
      const updatedRecord = { ...mockRecord, title: 'Updated Record' };
      const actual = passwordRecordsReducer(stateWithRecords, updateRecordSuccess(updatedRecord));
      expect(actual.records[0]).toEqual(updatedRecord);
      expect(actual.isLoading).toBe(false);
    });

    it('should handle updateRecordFailure', () => {
      const error = 'Update failed';
      const actual = passwordRecordsReducer(stateWithRecords, updateRecordFailure(error));
      expect(actual.error).toBe(error);
      expect(actual.isLoading).toBe(false);
    });
  });

  describe('createRecord', () => {
    it('should handle createRecordRequest', () => {
      const actual = passwordRecordsReducer(initialState, createRecordRequest());
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle createRecordSuccess', () => {
      const actual = passwordRecordsReducer(initialState, createRecordSuccess(mockRecord));
      expect(actual.records).toEqual([mockRecord]);
      expect(actual.isLoading).toBe(false);
    });

    it('should handle createRecordFailure', () => {
      const error = 'Create failed';
      const actual = passwordRecordsReducer(initialState, createRecordFailure(error));
      expect(actual.error).toBe(error);
      expect(actual.isLoading).toBe(false);
    });
  });

  describe('deleteRecord', () => {
    const stateWithRecords = {
      ...initialState,
      records: [mockRecord],
    };

    it('should handle deleteRecordRequest', () => {
      const actual = passwordRecordsReducer(stateWithRecords, deleteRecordRequest(1));
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle deleteRecordSuccess', () => {
      const actual = passwordRecordsReducer(stateWithRecords, deleteRecordSuccess(1));
      expect(actual.records).toEqual([]);
      expect(actual.isLoading).toBe(false);
    });

    it('should handle deleteRecordFailure', () => {
      const error = 'Delete failed';
      const actual = passwordRecordsReducer(stateWithRecords, deleteRecordFailure(error));
      expect(actual.error).toBe(error);
      expect(actual.isLoading).toBe(false);
    });
  });
});