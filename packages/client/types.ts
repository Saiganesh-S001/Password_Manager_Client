export interface PasswordRecord {
    id: number;
    title: string;
    username: string;
    password: string;
    url: string;
    user: User;
}

export interface PasswordRecordFormData {
    id: number;
    title: string;
    username: string;
    password: string;
    url: string;
}
  
export interface SharedPasswordRecord {
    id: number;
    password_record: PasswordRecord;
    owner: User;
    collaborator: User;
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

export interface SharedPasswordRecordRequest {
    email: string;
    password_record_id?: number;
}

export interface DeleteSharedPasswordRecordRequest {
    email: string;
    password_record_id: number;
}

export interface UpdateProfileRequest {
    email: string;
    display_name: string;
    password: string;
    current_password: string;
    password_confirmation: string;
}


export interface FetchRecordsResponse {
    owner_records: PasswordRecord[];
    shared_records: PasswordRecord[];
}