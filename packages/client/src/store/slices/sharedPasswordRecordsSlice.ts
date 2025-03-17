import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeleteSharedPasswordRecordRequest, SharedPasswordRecord, SharedPasswordRecordRequest } from '../../../types';

interface SharedPasswordRecordsState {
    sharedWithMe: SharedPasswordRecord[];
    sharedByMe: SharedPasswordRecord[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SharedPasswordRecordsState = {
    sharedWithMe: [],   
    sharedByMe: [],
    isLoading: false,
    error: null,
}

const sharedPasswordRecordsSlice = createSlice({
    name: 'sharedPasswordRecords',
    initialState,
    reducers: {
        fetchSharedWithMeRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchSharedWithMeSuccess: (state, action: PayloadAction<SharedPasswordRecord[]>) => {
            state.sharedWithMe = action.payload;
            state.isLoading = false;
        },
        fetchSharedWithMeFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        fetchSharedByMeRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchSharedByMeSuccess: (state, action: PayloadAction<SharedPasswordRecord[]>) => {
            state.sharedByMe = action.payload;
            state.isLoading = false;
        },
        fetchSharedByMeFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        createSharedPasswordRecordRequest: (state, action: PayloadAction<SharedPasswordRecordRequest>) => {
            state.isLoading = true;
            state.error = null;
        },
        createSharedPasswordRecordSuccess: (state, action: PayloadAction<SharedPasswordRecord>) => {
            state.sharedByMe.push(action.payload);
            state.isLoading = false;
        },
        createSharedPasswordRecordFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        deleteSharedPasswordRecordRequest: (state, action: PayloadAction<DeleteSharedPasswordRecordRequest>) => {
            state.isLoading = true;
            state.error = null;
        },
        deleteSharedPasswordRecordSuccess: (state, action: PayloadAction<number>) => {
            state.sharedByMe = state.sharedByMe.filter(record => record.id !== action.payload);
            state.isLoading = false;
        },
        deleteSharedPasswordRecordFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
})

export const { fetchSharedWithMeRequest, fetchSharedWithMeSuccess, fetchSharedWithMeFailure, fetchSharedByMeRequest, fetchSharedByMeSuccess, fetchSharedByMeFailure, createSharedPasswordRecordRequest, createSharedPasswordRecordSuccess, createSharedPasswordRecordFailure, deleteSharedPasswordRecordRequest, deleteSharedPasswordRecordSuccess, deleteSharedPasswordRecordFailure } = sharedPasswordRecordsSlice.actions;

export default sharedPasswordRecordsSlice.reducer;
