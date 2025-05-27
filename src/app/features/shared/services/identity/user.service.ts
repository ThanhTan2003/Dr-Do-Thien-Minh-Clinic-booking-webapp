import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserCreationRequest } from '../../../models/requests/identity/user-creation.request';
import { UserUpdateRequest } from '../../../models/requests/identity/user-update.request';
import { UserResponse } from '../../../models/responses/identity/user.response';
import { PageResponse } from '../../../models/responses/page-response.model';
import { HttpService } from '../../../../core/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpService) { }

    private readonly API_URL = '/api/v1/identity/user';

    createUser(request: UserCreationRequest): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/create`, request);
    }

    getUsers(page = 1, size = 10): Observable<PageResponse<UserResponse>> {
        return this.http.get<PageResponse<UserResponse>>(`${this.API_URL}/get-all?page=${page}&size=${size}`);
    }

    getUser(userName: string): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.API_URL}/user-name/${userName}`);
    }

    updateUser(userName: string, request: UserUpdateRequest): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/update/${userName}`, request);
    }

    updatePassword(userName: string, request: UserUpdateRequest): Observable<void> {
        return this.http.put<void>(`${this.API_URL}/update-password/${userName}`, request);
    }

    deleteUser(userName: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/delete/${userName}`);
    }

    getInfo(): Observable<UserResponse> {
        console.log("Lay thong tin nguoi dung API");
        return this.http.get<UserResponse>(`${this.API_URL}/get-info`);
    }

    searchUsers(keyword: string, page = 1, size = 10): Observable<PageResponse<UserResponse>> {
        return this.http.get<PageResponse<UserResponse>>(
            `${this.API_URL}/search?keyword=${keyword}&page=${page}&size=${size}`
        );
    }
}