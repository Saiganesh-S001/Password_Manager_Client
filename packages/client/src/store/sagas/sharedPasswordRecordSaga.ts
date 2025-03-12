import { call, put, takeLatest,all } from 'redux-saga/effects';
import { fetchSharedWithMeRequest, fetchSharedWithMeSuccess, fetchSharedWithMeFailure, fetchSharedByMeRequest, fetchSharedByMeSuccess, fetchSharedByMeFailure, createSharedPasswordRecordRequest, createSharedPasswordRecordSuccess, createSharedPasswordRecordFailure, deleteSharedPasswordRecordRequest, deleteSharedPasswordRecordSuccess, deleteSharedPasswordRecordFailure } from '../slices/sharedPasswordRecordsSlice';
import { SharedPasswordRecord } from '../../../types';
import apiClient from '../../client';
import { PayloadAction } from '@reduxjs/toolkit';

const fetchSharedWithMe = async (): Promise<SharedPasswordRecord[]> => {
    const response = await apiClient.get('/shared-password-records/shared-with-me');
    return response.data;
}

const fetchSharedByMe = async (): Promise<SharedPasswordRecord[]> => {
    const response = await apiClient.get('/shared-password-records/shared-by-me');
    return response.data;
}

const createSharedPasswordRecord = async (record: SharedPasswordRecord): Promise<SharedPasswordRecord> => {
    const response = await apiClient.post('/shared-password-records', record);
    return response.data;
}

const deleteSharedPasswordRecord = async (id: number): Promise<void> => {
    await apiClient.delete(`/shared-password-records/${id}`);
}


function* fetchSharedWithMeSaga(): Generator<any, void, SharedPasswordRecord[]> {
    try {
        const sharedWithMe = yield call(fetchSharedWithMe);
        yield put(fetchSharedWithMeSuccess(sharedWithMe));
    } catch (error: any) {
        yield put(fetchSharedWithMeFailure(error.message));
    }
}

function* fetchSharedByMeSaga(): Generator<any, void, SharedPasswordRecord[]> {
    try {
        const sharedByMe = yield call(fetchSharedByMe);
        yield put(fetchSharedByMeSuccess(sharedByMe));
    } catch (error: any) {
        yield put(fetchSharedByMeFailure(error.message));
    }
}

function* createSharedPasswordRecordSaga(action: PayloadAction<SharedPasswordRecord>): Generator<any, void, SharedPasswordRecord> {
    try {
        const record = yield call(createSharedPasswordRecord, action.payload);
        yield put(createSharedPasswordRecordSuccess(record));
    } catch (error: any) {
        yield put(createSharedPasswordRecordFailure(error.message));
    }
}

function* deleteSharedPasswordRecordSaga(action: PayloadAction<number>): Generator<any, void, void> {
    try {
        yield call(deleteSharedPasswordRecord, action.payload);
        yield put(deleteSharedPasswordRecordSuccess(action.payload));
    } catch (error: any) {
        yield put(deleteSharedPasswordRecordFailure(error.message));
    }
}

export function* watchSharedPasswordRecords() {
    yield all([ 
        takeLatest(fetchSharedWithMeRequest.type, fetchSharedWithMeSaga),
        takeLatest(fetchSharedByMeRequest.type, fetchSharedByMeSaga),
        takeLatest(createSharedPasswordRecordRequest.type, createSharedPasswordRecordSaga),
        takeLatest(deleteSharedPasswordRecordRequest.type, deleteSharedPasswordRecordSaga),
    ]); // this will take the latest action and run the saga parallel
}