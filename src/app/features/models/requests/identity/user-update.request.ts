export interface UserUpdateRequest {
    userName: string;
    password: string;
    accountName: string;
    status: string;
    lastAccessTime: string;
    doctorId: string;
    roles: string[];
}