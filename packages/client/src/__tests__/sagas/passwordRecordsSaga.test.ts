import { expectSaga } from 'redux-saga-test-plan';

import {
  fetchRecordsSaga,
  createRecordSaga,
  updateRecordSaga,
  deleteRecordSaga,
  fetchRecordSaga,
} from '../../store/sagas/passwordRecordSaga';
import {
  fetchRecordsRequest,
  fetchRecordsSuccess,
  fetchRecordsFailure,
  createRecordRequest,
  createRecordSuccess,
  createRecordFailure,
  updateRecordRequest,
  updateRecordSuccess,
  updateRecordFailure,
  deleteRecordRequest,
  deleteRecordSuccess,
  deleteRecordFailure,
  fetchRecordRequest,
  fetchRecordSuccess,
  fetchRecordFailure,
} from '../../store/slices/passwordRecordsSlice';
import apiClient from '../../client';
import { PasswordRecord } from '../../../types';


jest.mock('../../client');

beforeEach(() => {
  jest.clearAllMocks();
});

const mockPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
const mockPut = apiClient.put as jest.MockedFunction<typeof apiClient.put>;
const mockDelete = apiClient.delete as jest.MockedFunction<typeof apiClient.delete>;
const mockGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>;



// Mock setup
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

// Tests
describe('passwordRecordSaga', () => {
  describe('fetchRecordsSaga', () => {
    const searchParams = { search_by_title: 'test' };
    const response = { owner_records: [mockRecord], shared_records: [] };

    it('handles successful records fetch', () => {
      mockGet.mockResolvedValue({ data: response });
      return expectSaga(fetchRecordsSaga, fetchRecordsRequest(searchParams))
        .put(fetchRecordsSuccess(response))
        .run();
    });

    it('handles records fetch failure', () => {
      const error = new Error('Fetch failed');
      mockGet.mockRejectedValue(error);
      return expectSaga(fetchRecordsSaga, fetchRecordsRequest(searchParams))
        .put(fetchRecordsFailure(error.message))
        .run();
    });
  });

  describe('fetchRecordSaga', () => {
    it('handles successful record fetch', () => {
      mockGet.mockResolvedValue({ data: mockRecord });
      return expectSaga(fetchRecordSaga, fetchRecordRequest(1))
        .put(fetchRecordSuccess(mockRecord))
        .run();
    });

    it('handles record fetch failure', () => {
      const error = new Error('Fetch failed');
      mockGet.mockRejectedValue(error);
      return expectSaga(fetchRecordSaga, fetchRecordRequest(1))
        .put(fetchRecordFailure(error.message))
        .run();
    });
  });

  describe('createRecordSaga', () => {
    const newRecord = {
      title: 'New Record',
      username: 'newuser',
      password: 'newpass',
      url: 'https://new.com',
    } as PasswordRecord;

    it('handles successful record creation', () => {
      mockPost.mockResolvedValue({ data: mockRecord });
      return expectSaga(createRecordSaga, {type: createRecordRequest.type, payload: newRecord})
        .put(createRecordSuccess(mockRecord))
        .run();
    });

    it('handles record creation failure', () => {
      const error = new Error('Creation failed');
      mockPost.mockRejectedValue(error);
      return expectSaga(createRecordSaga, {type: createRecordRequest.type, payload: newRecord})
        .put(createRecordFailure(error.message))
        .run();
    });
  });

  describe('updateRecordSaga', () => {
    const updateData = {
      id: 1,
      title: 'Updated Record',
      username: 'updateduser',
      password: 'updatedpass',
      url: 'https://updated.com',
    } as PasswordRecord;

    it('handles successful record update', () => {
      const updatedRecord = { ...mockRecord, ...updateData };
      mockPut.mockResolvedValue({ data: updatedRecord });
      return expectSaga(updateRecordSaga, {type: updateRecordRequest.type, payload: updateData})
        .put(updateRecordSuccess(updatedRecord))
        .run();
    });

    it('handles record update failure', () => {
      const error = new Error('Update failed');
      mockPut.mockRejectedValue(error);
      return expectSaga(updateRecordSaga, updateRecordRequest(updateData))
        .put(updateRecordFailure(error.message))
        .run();
    });
  });

  describe('deleteRecordSaga', () => {
    it('handles successful record deletion', () => {
      mockDelete.mockResolvedValue({ data: null });
      return expectSaga(deleteRecordSaga, deleteRecordRequest(1))
        .put(deleteRecordSuccess(1))
        .run();
    });

    it('handles record deletion failure', () => {
      const error = new Error('Delete failed');
      mockDelete.mockRejectedValue(error);
      return expectSaga(deleteRecordSaga, deleteRecordRequest(1))
        .put(deleteRecordFailure(error.message))
        .run();
    });
  });
});