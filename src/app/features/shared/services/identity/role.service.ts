import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleResponse } from '../../../models/responses/identity/role.response';
import { HttpService } from '../../../../core/services/http.service';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    constructor(private http: HttpService) { }

    private readonly API_URL = '/api/v1/identity/role';

    getAllRoles(): Observable<RoleResponse[]> {
        return this.http.get<RoleResponse[]>(`${this.API_URL}/get-all`);
    }

    getAllRolesExceptNguoiDung(): Observable<RoleResponse[]> {
        return this.http.get<RoleResponse[]>(`${this.API_URL}/get-all-except-nguoi-dung`);
    }

}