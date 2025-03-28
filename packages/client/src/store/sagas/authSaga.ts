import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../client';
import { loginRequest, loginSuccess, loginFailure, registerRequest, registerSuccess, registerFailure, logoutRequest, logoutSuccess, logoutFailure, updateProfileRequest, updateProfileSuccess, updateProfileFailure, deleteAccountRequest, deleteAccountSuccess, deleteAccountFailure } from '../slices/authSlice';
import { RegisterRequest, UpdateProfileRequest, User} from '../../../types';
import { LoginResponse } from '../../../types';
import storage from 'redux-persist/lib/storage';

const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
}

const register = async (registerRequest: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', registerRequest);
    return response.data;
}

const updateProfile = async (updateProfileRequest: UpdateProfileRequest): Promise<{user: User}> => {
    const response = await apiClient.put('/auth/update', updateProfileRequest);
    return response.data;
}

const logout = async (): Promise<void> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
}

const deleteAccount = async (): Promise<void> => {
    const response = await apiClient.delete('/auth/delete');
    return response.data;
}

export const loginSaga = function* (action: PayloadAction<{ email: string, password: string }>): Generator<any, void, LoginResponse> {
    try {
        const loginResponse = yield call(login, action.payload.email, action.payload.password);
        yield put(loginSuccess(loginResponse));
        localStorage.setItem('token', loginResponse.token);
    } catch (error: any) {
        yield put(loginFailure(error.message));
    }
}

export const registerSaga = function* (action: PayloadAction<RegisterRequest>): Generator<any, void, LoginResponse> {
    try {
        const registerResponse = yield call(register, action.payload);
        yield put(registerSuccess(registerResponse));
        localStorage.setItem('token', registerResponse.token);
    } catch (error: any) {
        yield put(registerFailure(error.message));
    }
}

export const logoutSaga = function* (): Generator<any, void, void> {
    try {
        yield call(logout);
        localStorage.removeItem('token');
        storage.removeItem('persist:root');
        localStorage.removeItem('persist:root');
        yield put(logoutSuccess());
    } catch (error: any) {
        yield put(logoutFailure(error.message));
    }
}

export const updateProfileSaga = function* (action: PayloadAction<UpdateProfileRequest>): Generator<any, void, {user: User}> {  
    try {
        const updateProfileResponse = yield call(updateProfile, action.payload);
        yield put(updateProfileSuccess(updateProfileResponse.user));
    } catch (error: any) {
        yield put(updateProfileFailure(error.message));
    }
}

export const deleteAccountSaga = function* (): Generator<any, void, void> {
    try {
        yield call(deleteAccount);
        yield put(deleteAccountSuccess());
    } catch (error: any) {
        yield put(deleteAccountFailure(error.message));
    }
}

export function* watchAuthSaga(): Generator<any, void, void> {
    yield all([
        takeLatest(loginRequest.type, loginSaga),
        takeLatest(registerRequest.type, registerSaga),
        takeLatest(logoutRequest.type, logoutSaga),
        takeLatest(updateProfileRequest.type, updateProfileSaga),
        takeLatest(deleteAccountRequest.type, deleteAccountSaga),
    ]);
}












