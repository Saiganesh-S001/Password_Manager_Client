import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginRequest, LoginResponse, RegisterRequest } from '../../../types';
import storage from 'redux-persist/lib/storage';

const token = localStorage.getItem('token');

const initialState: AuthState = {
    user: null,
    isAuthenticated: token ? true : false,
    isLoading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest: (state, action: PayloadAction<LoginRequest>) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logoutRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');
            storage.removeItem('persist:root');
        },
        logoutFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        registerRequest: (state, action: PayloadAction<RegisterRequest>) => {
            state.isLoading = true;
            state.error = null;
        },
        registerSuccess: (state, action: PayloadAction<LoginResponse>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        registerFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
})

export const { loginRequest, loginSuccess, loginFailure, logoutRequest, logoutSuccess, logoutFailure, registerRequest, registerSuccess, registerFailure } = authSlice.actions; // exporting actions for use in components and sagas

export default authSlice.reducer; // importing reducer for use in store

