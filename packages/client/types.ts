export interface PasswordRecord {
    id: number;
    title: string;
    username: string;
    password: string;
    url: string;
    user_id: number;
}
  
export interface SharedPasswordRecord {
    id: number;
    password_record_id: number;
    owner_id: number;
    collaborator_id: number;
    password_record: PasswordRecord;
}
  
export interface User {
    id: number;
    email: string;
    display_name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    display_name: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface PasswordRecordsState {
    records: PasswordRecord[];
    loading: boolean;
    error: string | null;
}
  
export interface SharedPasswordRecordsState {
    sharedWithMe: SharedPasswordRecord[];
    sharedByMe: SharedPasswordRecord[];
    loading: boolean;
    error: string | null;
}

export interface RootState {
    auth: AuthState;
    passwordRecords: PasswordRecordsState;
    sharedPasswordRecords: SharedPasswordRecordsState;
}

