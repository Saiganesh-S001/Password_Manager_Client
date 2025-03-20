import { call, put, takeLatest,all } from 'redux-saga/effects';
import { fetchSharedWithMeRequest, fetchSharedWithMeSuccess, fetchSharedWithMeFailure, fetchSharedByMeRequest, fetchSharedByMeSuccess, fetchSharedByMeFailure, createSharedPasswordRecordRequest, createSharedPasswordRecordSuccess, createSharedPasswordRecordFailure, deleteSharedPasswordRecordRequest, deleteSharedPasswordRecordSuccess, deleteSharedPasswordRecordFailure } from '../slices/sharedPasswordRecordsSlice';
import { SharedPasswordRecord, SharedPasswordRecordRequest, DeleteSharedPasswordRecordRequest } from '../../../types';
import apiClient from '../../client';
import { PayloadAction } from '@reduxjs/toolkit';

const fetchSharedWithMe = async (): Promise<SharedPasswordRecord[]> => {
    const response = await apiClient.get('/shared_password_records/shared_with_me');
    return response.data;
}

const fetchSharedByMe = async (): Promise<SharedPasswordRecord[]> => {
    const response = await apiClient.get('/shared_password_records/shared_by_me');
    return response.data;
}

const createSharedPasswordRecord = async (recordDetails: SharedPasswordRecordRequest): Promise<SharedPasswordRecord> => {
    const response = await apiClient.post('/shared_password_records', recordDetails);
    return response.data;
}

const deleteSharedPasswordRecord = async (recordDetails: DeleteSharedPasswordRecordRequest): Promise<void> => {
    await apiClient.delete(`/shared_password_records`, { data: recordDetails });
}


export const fetchSharedWithMeSaga = function* (): Generator<any, void, SharedPasswordRecord[]> {
    try {
        const sharedWithMe = yield call(fetchSharedWithMe);
        yield put(fetchSharedWithMeSuccess(sharedWithMe));
    } catch (error: any) {
        yield put(fetchSharedWithMeFailure(error.message));
    }
}

export const fetchSharedByMeSaga = function* (): Generator<any, void, SharedPasswordRecord[]> {
    try {
        const sharedByMe = yield call(fetchSharedByMe);
        yield put(fetchSharedByMeSuccess(sharedByMe));
    } catch (error: any) {
        yield put(fetchSharedByMeFailure(error.message));
    }
}

export const createSharedPasswordRecordSaga = function* (action: PayloadAction<SharedPasswordRecordRequest>): Generator<any, void, SharedPasswordRecord> {
    try {
        const record = yield call(createSharedPasswordRecord, action.payload);
        yield put(createSharedPasswordRecordSuccess(record));
    } catch (error: any) {
        yield put(createSharedPasswordRecordFailure(error.message));
    }
}

export const deleteSharedPasswordRecordSaga = function* (action: PayloadAction<DeleteSharedPasswordRecordRequest>): Generator<any, void, void> {
    try {
        yield call(deleteSharedPasswordRecord, action.payload);
        yield put(deleteSharedPasswordRecordSuccess(action.payload.password_record_id));
    } catch (error: any) {
        yield put(deleteSharedPasswordRecordFailure(error.message));
    }
}

export const watchSharedPasswordRecords = function* (): Generator<any, void, void> {
    yield all([ 
        takeLatest(fetchSharedWithMeRequest.type, fetchSharedWithMeSaga),
        takeLatest(fetchSharedByMeRequest.type, fetchSharedByMeSaga),
        takeLatest(createSharedPasswordRecordRequest.type, createSharedPasswordRecordSaga),
        takeLatest(deleteSharedPasswordRecordRequest.type, deleteSharedPasswordRecordSaga),
    ]); // this will take the latest action and run the saga parallel
}