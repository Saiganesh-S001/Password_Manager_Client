import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PasswordRecord } from '../../../types';

interface PasswordRecordsState {
    records: PasswordRecord[];
    currentRecord: PasswordRecord | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: PasswordRecordsState = {
    records: [],
    currentRecord: null,
    isLoading: false,
    error: null,
}

const passwordRecordsSlice = createSlice({
    name: 'passwordRecords',
    initialState,
    reducers: {
        fetchRecordsRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchRecordsSuccess: (state, action: PayloadAction<PasswordRecord[]>) => {
            state.records = action.payload;
            state.isLoading = false;
        },
        fetchRecordsFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        createRecordRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        createRecordSuccess: (state, action: PayloadAction<PasswordRecord>) => {
            state.records.push(action.payload); 
            state.isLoading = false;
        },
        createRecordFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        updateRecordRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        updateRecordSuccess: (state, action: PayloadAction<PasswordRecord>) => {
            const index = state.records.findIndex(record => record.id === action.payload.id);
            if (index !== -1) {
                state.records[index] = action.payload;
            }
            state.isLoading = false;
        },
        updateRecordFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        deleteRecordRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        deleteRecordSuccess: (state, action: PayloadAction<number>) => {
            state.records = state.records.filter(record => record.id !== action.payload);
            state.isLoading = false;
        },
        deleteRecordFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
})

export const { fetchRecordsRequest, fetchRecordsSuccess, fetchRecordsFailure, createRecordRequest, createRecordSuccess, createRecordFailure, updateRecordRequest, updateRecordSuccess, updateRecordFailure, deleteRecordRequest, deleteRecordSuccess, deleteRecordFailure } = passwordRecordsSlice.actions;

export default passwordRecordsSlice.reducer;
