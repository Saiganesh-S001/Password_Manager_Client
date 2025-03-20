import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import authReducer from '../store/slices/authSlice';
import passwordRecordsReducer from '../store/slices/passwordRecordsSlice';
import sharedPasswordRecordsReducer from '../store/slices/sharedPasswordRecordsSlice';
import { PasswordRecord, SharedPasswordRecord, User } from '../../types';

export interface InitialState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  },
  passwordRecords: {
    records: PasswordRecord[];
    sharedRecords: PasswordRecord[];
    currentRecord: PasswordRecord | null;
    isLoading: boolean;
    error: string | null;
  },
  sharedPasswordRecords: {
    sharedWithMe: SharedPasswordRecord[];
    sharedByMe: SharedPasswordRecord[];
    isLoading: boolean;
    error: string | null;
  }
}

const createTestStore = (initialState: InitialState, mockSagas = []) => {
  // Create saga middleware
  const sagaMiddleware = createSagaMiddleware();
  
  // Create a list to store dispatched actions
  const actions: any[] = [];
  
  // Create middleware to track actions
  const actionTrackingMiddleware = () => (next: any) => (action: any) => {
    actions.push(action);
    return next(action);
  };
  
  const store = configureStore({
    reducer: {
      auth: authReducer,
      passwordRecords: passwordRecordsReducer,
      sharedPasswordRecords: sharedPasswordRecordsReducer,
    },
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({ thunk: false })
        .concat(sagaMiddleware, actionTrackingMiddleware),
    preloadedState: {
      auth: initialState.auth,
      passwordRecords: initialState.passwordRecords,
      sharedPasswordRecords: initialState.sharedPasswordRecords,        
    },
  });

  // Root saga that combines all mock sagas
  function* rootSaga() {
    yield all(mockSagas);
  }
  
  // Run the root saga
  sagaMiddleware.run(rootSaga);

  // Add getActions method to store
  (store as any).getActions = () => actions;
  
  // Add clearActions method to store
  (store as any).clearActions = () => {
    actions.length = 0;
  };

  return store;
};

const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
      passwordRecords: {
        records: [],
        sharedRecords: [],
        currentRecord: null,
        isLoading: false,
        error: null,
      },
      sharedPasswordRecords: {
        sharedWithMe: [],
        sharedByMe: [],
        isLoading: false,
        error: null,
      },
    },
    mockSagas = [],
    store = createTestStore(preloadedState, mockSagas),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export * from '@testing-library/react';
export { renderWithProviders, createTestStore };