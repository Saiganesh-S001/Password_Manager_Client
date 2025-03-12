import { call, put, takeLatest, all } from 'redux-saga/effects';
import { fetchRecordsRequest, fetchRecordsSuccess, fetchRecordsFailure, createRecordRequest, createRecordSuccess, createRecordFailure, updateRecordRequest, updateRecordSuccess, updateRecordFailure, deleteRecordRequest, deleteRecordSuccess, deleteRecordFailure } from '../slices/passwordRecordsSlice';
import { PasswordRecord } from '../../../types';
import apiClient from '../../client';
import { PayloadAction } from '@reduxjs/toolkit';


const fetchPasswordRecords = async (): Promise<PasswordRecord[]> => {
    const response = await apiClient.get('/password-records');
    return response.data;
}

const createPasswordRecord = async (record: PasswordRecord): Promise<PasswordRecord> => {
    const response = await apiClient.post('/password-records', record);
    return response.data;
}

const updatePasswordRecord = async (record: PasswordRecord): Promise<PasswordRecord> => {
    const response = await apiClient.put(`/password-records/${record.id}`, record);
    return response.data;
}

const deletePasswordRecord = async (id: number): Promise<void> => {
    await apiClient.delete(`/password-records/${id}`);
}


function* fetchRecordsSaga(): Generator<any, void, PasswordRecord[]> {
    try {
        const records = yield call(fetchPasswordRecords);
        yield put(fetchRecordsSuccess(records));
    } catch (error: any) {
        yield put(fetchRecordsFailure(error.message));
    }
}

function* createRecordSaga(action: PayloadAction<PasswordRecord>): Generator<any, void, PasswordRecord> {
    try {
        const createResponse = yield call(createPasswordRecord, action.payload);
        yield put(createRecordSuccess(createResponse))
    } catch (error: any) {
        yield put(createRecordFailure(error.message));
    }
}

function* deleteRecordSaga(action: PayloadAction<number>): Generator<any, void, void> {
    try {
        yield call(deletePasswordRecord, action.payload);
        yield put(deleteRecordSuccess(action.payload));
    } catch (error: any) {
        yield put(deleteRecordFailure(error.message));
    }
}

function* updateRecordSaga(action: PayloadAction<PasswordRecord>): Generator<any, void, PasswordRecord> {
    try {
        const updateResponse = yield call(updatePasswordRecord, action.payload);
        yield put(updateRecordSuccess(updateResponse));
    } catch (error: any) {
        yield put(updateRecordFailure(error.message));
    }
}

export function* watchPasswordRecordSaga(): Generator<any, void, void> {
    yield all([
        takeLatest(fetchRecordsRequest.type, fetchRecordsSaga),
        takeLatest(createRecordRequest.type, createRecordSaga),
        takeLatest(deleteRecordRequest.type, deleteRecordSaga),
        takeLatest(updateRecordRequest.type, updateRecordSaga),
    ])
}