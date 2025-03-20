import { expectSaga } from 'redux-saga-test-plan';
import {
  fetchSharedWithMeSaga,
  fetchSharedByMeSaga,
  createSharedPasswordRecordSaga,
  deleteSharedPasswordRecordSaga,
} from '../../store/sagas/sharedPasswordRecordSaga';
import {
  fetchSharedWithMeSuccess,
  fetchSharedWithMeFailure,
  fetchSharedByMeSuccess,
  fetchSharedByMeFailure,
  createSharedPasswordRecordRequest,
  createSharedPasswordRecordSuccess,
  createSharedPasswordRecordFailure,
  deleteSharedPasswordRecordRequest,
  deleteSharedPasswordRecordSuccess,
  deleteSharedPasswordRecordFailure,
} from '../../store/slices/sharedPasswordRecordsSlice';
import apiClient from '../../client';
import { SharedPasswordRecord, SharedPasswordRecordRequest } from '../../../types';

jest.mock('../../client');

beforeEach(() => {
  jest.clearAllMocks();
});

const mockGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>;
const mockPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
const mockDelete = apiClient.delete as jest.MockedFunction<typeof apiClient.delete>;

describe('sharedPasswordRecordSaga', () => {
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
      user: {
        id: 1,
        email: 'test@example.com',
        display_name: 'Test User',
      },
    },
  };

  describe('fetchSharedWithMeSaga', () => {
    it('handles successful shared records fetch', () => {
      mockGet.mockResolvedValue({ data: [mockSharedRecord] });
      return expectSaga(fetchSharedWithMeSaga)
        .put(fetchSharedWithMeSuccess([mockSharedRecord as unknown as SharedPasswordRecord]))
        .run();
    });

    it('handles shared records fetch failure', () => {
      const error = new Error('Fetch failed');
      mockGet.mockRejectedValue(error);
      return expectSaga(fetchSharedWithMeSaga)
        .put(fetchSharedWithMeFailure(error.message))
        .run();
    });
  });

  describe('fetchSharedByMeSaga', () => {
    it('handles successful shared records fetch', () => {
      mockGet.mockResolvedValue({ data: [mockSharedRecord] });
      return expectSaga(fetchSharedByMeSaga)
        .put(fetchSharedByMeSuccess([mockSharedRecord as SharedPasswordRecord]))
        .run();
    });

    it('handles shared records fetch failure', () => {
      const error = new Error('Fetch failed');
      mockGet.mockRejectedValue(error);
      return expectSaga(fetchSharedByMeSaga)
        .put(fetchSharedByMeFailure(error.message))
        .run();
    });
  });

  describe('createSharedPasswordRecordSaga', () => {
    const shareData = {
      password_record_id: 1,
      email: 'test@example.com',
    };

    it('handles successful share creation', () => {
      mockPost.mockResolvedValue({ data: mockSharedRecord });
      return expectSaga(createSharedPasswordRecordSaga, {type: createSharedPasswordRecordRequest.type, payload: shareData as SharedPasswordRecordRequest})
        .put(createSharedPasswordRecordSuccess(mockSharedRecord as unknown as SharedPasswordRecord))
        .run();
    });

    it('handles share creation failure', () => {
      const error = new Error('Share failed');
      mockPost.mockRejectedValue(error);
      return expectSaga(createSharedPasswordRecordSaga, createSharedPasswordRecordRequest(shareData))
        .put(createSharedPasswordRecordFailure(error.message))
        .run();
    });
  });

  describe('deleteSharedPasswordRecordSaga', () => {
    const deleteData = {
      id: 1,
      password_record_id: 1,
      email: 'test@example.com',
    };

    it('handles successful share deletion', () => {
      mockDelete.mockResolvedValue({ data: null });
      return expectSaga(deleteSharedPasswordRecordSaga, deleteSharedPasswordRecordRequest(deleteData))
        .put(deleteSharedPasswordRecordSuccess(deleteData.password_record_id))
        .run();
    });

    it('handles share deletion failure', () => {
      const error = new Error('Delete failed');
      mockDelete.mockRejectedValue(error);
      return expectSaga(deleteSharedPasswordRecordSaga, deleteSharedPasswordRecordRequest(deleteData))
        .put(deleteSharedPasswordRecordFailure(error.message))
        .run();
    });
  });
});