import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PasswordRecord, PasswordRecordFormData, FetchRecordsResponse } from '../../../types';

interface PasswordRecordsState {
    records: PasswordRecord[];
    sharedRecords: PasswordRecord[];
    currentRecord: PasswordRecord | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: PasswordRecordsState = {
    records: [],
    sharedRecords: [],
    currentRecord: null,
    isLoading: false,
    error: null,
}

interface SearchFormInputs {
    search_by_title?: string;
    search_by_username?: string;
    search_by_url?: string;
}

const passwordRecordsSlice = createSlice({
    name: 'passwordRecords',
    initialState,
    reducers: {
        fetchRecordsRequest: (state, action: PayloadAction<SearchFormInputs>) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchRecordsSuccess: (state, action: PayloadAction<FetchRecordsResponse>) => {
            state.records = action.payload.owner_records;
            state.sharedRecords = action.payload.shared_records;
            state.isLoading = false;
        },
        fetchRecordsFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        fetchRecordRequest: (state, action: PayloadAction<number>) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchRecordSuccess: (state, action: PayloadAction<PasswordRecord>) => {
            state.currentRecord = action.payload;
            state.isLoading = false;
        },
        fetchRecordFailure: (state, action: PayloadAction<string>) => {
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
        updateRecordRequest: (state, action: PayloadAction<PasswordRecordFormData>) => {
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
        deleteRecordRequest: (state, action: PayloadAction<number>) => {
            console.log("deleteRecordRequest", action.payload);
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

export const { fetchRecordsRequest, 
    fetchRecordsSuccess, 
    fetchRecordsFailure, 
    fetchRecordRequest, 
    fetchRecordSuccess, 
    fetchRecordFailure, 
    createRecordRequest, 
    createRecordSuccess, 
    createRecordFailure, 
    updateRecordRequest, 
    updateRecordSuccess, 
    updateRecordFailure, 
    deleteRecordRequest, 
    deleteRecordSuccess, 
    deleteRecordFailure } = passwordRecordsSlice.actions;

export default passwordRecordsSlice.reducer;
