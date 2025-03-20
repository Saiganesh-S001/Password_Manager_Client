import { call, put, takeLatest, all } from 'redux-saga/effects';
import { fetchRecordsRequest, fetchRecordsSuccess, fetchRecordsFailure, createRecordRequest, createRecordSuccess, createRecordFailure, updateRecordRequest, updateRecordSuccess, updateRecordFailure, deleteRecordRequest, deleteRecordSuccess, deleteRecordFailure,fetchRecordRequest,fetchRecordSuccess,fetchRecordFailure } from '../slices/passwordRecordsSlice';
import { PasswordRecord, PasswordRecordFormData } from '../../../types';
import apiClient from '../../client';
import { PayloadAction } from '@reduxjs/toolkit';

interface SearchFormInputs {
    search_by_title?: string;
    search_by_username?: string;
    search_by_url?: string;
}

interface FetchRecordsResponse {
    owner_records: PasswordRecord[];
    shared_records: PasswordRecord[];
}


const fetchPasswordRecord = async (id: number): Promise<PasswordRecord> => {
    const response = await apiClient.get(`/password_records/${id}`);
    return response.data;
}

const fetchPasswordRecords = async (searchFormInputs: SearchFormInputs): Promise<FetchRecordsResponse> => {
    const response = await apiClient.get('/password_records', { params: searchFormInputs });
    return response.data;
}

const createPasswordRecord = async (record: PasswordRecord): Promise<PasswordRecord> => {
    const response = await apiClient.post('/password_records', record);
    return response.data;
}

const updatePasswordRecord = async (record: PasswordRecordFormData): Promise<PasswordRecord> => {
    const response = await apiClient.put(`/password_records/${record.id}`, record);
    return response.data;
}

const deletePasswordRecord = async (id: number): Promise<void> => {
    await apiClient.delete(`/password_records/${id}`);
}


export const fetchRecordsSaga = function* (action: PayloadAction<SearchFormInputs>): Generator<any, void, FetchRecordsResponse> {
    try {
        const records = yield call(fetchPasswordRecords, action.payload);
        yield put(fetchRecordsSuccess(records));
    } catch (error: any) {
        yield put(fetchRecordsFailure(error.message));
    }
}

export const createRecordSaga = function* (action: PayloadAction<PasswordRecord>): Generator<any, void, PasswordRecord> {
    try {
        const createResponse = yield call(createPasswordRecord, action.payload);
        yield put(createRecordSuccess(createResponse))
    } catch (error: any) {
        yield put(createRecordFailure(error.message));
    }
}

export const deleteRecordSaga = function* (action: PayloadAction<number>): Generator<any, void, void> {
    try {
        yield call(deletePasswordRecord, action.payload);
        yield put(deleteRecordSuccess(action.payload));
    } catch (error: any) {
        yield put(deleteRecordFailure(error.message));
    }
}

export const updateRecordSaga = function* (action: PayloadAction<PasswordRecordFormData>): Generator<any, void, PasswordRecord> {
    try {
        const updateResponse = yield call(updatePasswordRecord, action.payload);
        yield put(updateRecordSuccess(updateResponse));
    } catch (error: any) {
        yield put(updateRecordFailure(error.message));
    }
}

export const fetchRecordSaga = function* (action: PayloadAction<number>): Generator<any, void, PasswordRecord> {
    try {
        const record = yield call(fetchPasswordRecord, action.payload);
        yield put(fetchRecordSuccess(record));
    } catch (error: any) {
        yield put(fetchRecordFailure(error.message));
    }
}   
export const watchPasswordRecordSaga = function* (): Generator<any, void, void> {
    yield all([
        takeLatest(fetchRecordsRequest.type, fetchRecordsSaga),
        takeLatest(createRecordRequest.type, createRecordSaga),
        takeLatest(deleteRecordRequest.type, deleteRecordSaga),
        takeLatest(updateRecordRequest.type, updateRecordSaga),
        takeLatest(fetchRecordRequest.type, fetchRecordSaga),
    ])
}