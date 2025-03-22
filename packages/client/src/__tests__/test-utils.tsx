import { configureStore, Store } from "@reduxjs/toolkit";
import { RootState } from "../store";
import rootReducer from "../store/rootReducer";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";

interface TestStore extends Store<RootState> {
    getActions: () => any[];
}

// omiting persist property from the state

export const defaultInitialState: RootState = {
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
    _persist: {
        version: -1,
        rehydrated: false
    }
};

export function createTestStore(preloadedState: Partial<RootState> = {}): TestStore {
    const actions: any[] = [];
    const store = configureStore({
        reducer: rootReducer,
        preloadedState: { ...defaultInitialState, ...preloadedState },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false,
        }),
    }) as TestStore;

    const originalDispatch = store.dispatch;
    store.dispatch = (action: any) => {
        actions.push(action);
        return originalDispatch(action);
    };
        
    store.getActions = () => actions;

    return store;
}

// this is a helper function to render a component with a store
export function renderWithProviders(
    ui: React.ReactNode, 
    { preloadedState = defaultInitialState, 
    ...renderOptions
    } : { preloadedState?: Partial<RootState>, renderOptions?: RenderOptions } = {}) {
    
    const store = createTestStore(preloadedState);

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <Provider store={store}>
                {children}
            </Provider>
        )
    }
    return { 
        store, 
        ...render(ui, { wrapper: Wrapper, ...renderOptions }) 
    }; // return the store and the rendered component which is wrapped in the provider
}

// this is a helper function to render a component with a router
export function renderWithRouter(ui: React.ReactNode, { route = '/', ...renderOptions }: { route?: string } = {}) {
    window.history.pushState({}, 'Test page', route);
    return render(ui, renderOptions);
}

// this is a helper function to render a component with a router and a store
export function renderWithRouterAndStore(ui: React.ReactNode, { route = '/', preloadedState, ...renderOptions }: { route?: string, preloadedState?: Partial<RootState> } = {}) {
    const store = createTestStore(preloadedState);
    return { store, ...renderWithRouter(<Provider store={store}>{ui}</Provider>, { route, ...renderOptions }) };
}


export * from '@testing-library/react';
export * from '@testing-library/user-event';
