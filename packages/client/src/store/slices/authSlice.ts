import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginRequest, LoginResponse, RegisterRequest, User, UpdateProfileRequest } from '../../../types';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';


const token = localStorage.getItem('token');

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

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
            state.isLoading = false;
            state.error = null;
        },
        logoutFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        updateProfileRequest: (state, action: PayloadAction<UpdateProfileRequest>) => {
            console.log("updateProfileRequest", action.payload);
            state.isLoading = true;
            state.error = null;
        },
        updateProfileSuccess: (state, action: PayloadAction<User>) => {
            console.log("updateProfileSuccess", action.payload);
            state.isLoading = false;
            state.user = action.payload;
        },
        updateProfileFailure: (state, action) => {
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
        },
        deleteAccountRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        deleteAccountSuccess: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
        deleteAccountFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;   
        }
    }
})

// const persistConfig = {
//     key: 'auth',
//     storage,
//     whitelist: ['user', 'isAuthenticated'], // only persist user and isAuthenticated
// }

//const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer); // use this later

export const { loginRequest, loginSuccess, loginFailure, logoutRequest, logoutSuccess, logoutFailure, registerRequest, registerSuccess, registerFailure, updateProfileRequest, updateProfileSuccess, updateProfileFailure, deleteAccountRequest, deleteAccountSuccess, deleteAccountFailure } = authSlice.actions; // exporting actions for use in components and sagas

export default authSlice.reducer; // importing reducer for use in store

