import { call, put, takeLatest, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../client';
import { loginRequest, loginSuccess, loginFailure, registerRequest, registerSuccess, registerFailure, logoutRequest, logoutSuccess, logoutFailure } from '../slices/authSlice';
import { RegisterRequest} from '../../../types';
import { LoginResponse } from '../../../types';

const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
}

const register = async (registerRequest: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', registerRequest);
    return response.data;
}

const logout = async (): Promise<void> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
}

function* loginSaga(action: PayloadAction<{ email: string, password: string }>): Generator<any, void, LoginResponse> {
    try {
        const loginResponse = yield call(login, action.payload.email, action.payload.password);
        yield put(loginSuccess(loginResponse));
        localStorage.setItem('token', loginResponse.token);
    } catch (error: any) {
        yield put(loginFailure(error.message));
    }
}

function* registerSaga(action: PayloadAction<RegisterRequest>): Generator<any, void, LoginResponse> {
    try {
        const registerResponse = yield call(register, action.payload);
        yield put(registerSuccess(registerResponse));
        localStorage.setItem('token', registerResponse.token);
    } catch (error: any) {
        yield put(registerFailure(error.message));
    }
}

function* logoutSaga(): Generator<any, void, void> {
    try {
        yield call(logout);
        yield put(logoutSuccess());
    } catch (error: any) {
        yield put(logoutFailure(error.message));
    }
}

export function* watchAuthSaga(): Generator<any, void, void> {
    yield all([
        takeLatest(loginRequest.type, loginSaga),
        takeLatest(registerRequest.type, registerSaga),
        takeLatest(logoutRequest.type, logoutSaga),
    ]);
}












