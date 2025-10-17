import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http.service';
import { AccountResponse } from '../../../models/responses/identity/account/account.response';
import { AccountCreationRequest } from '../../../models/requests/identity/account/account-creation.request';
import { AccountUpdateRequest } from '../../../models/requests/identity/account/account-update.request';
import { PageResponse } from '../../../models/responses/page-response.model';
import { RoleResponse } from '../../../models/responses/identity/account/role.response';
import { StatusResponse } from '../../../models/responses/identity/account/status.response';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly API_URL = '/api/v1/identity/account';

  constructor(private http: HttpService) {}

  /**
   * Tạo tài khoản mới
   */
  createUser(request: AccountCreationRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/create`, request);
  }

  /**
   * Lấy danh sách tài khoản có lọc và phân trang
   */
  getUsers(
    keyword = '',
    statusId?: string,
    roleId?: string,
    page = 1,
    size = 10
  ): Observable<PageResponse<AccountResponse>> {
    let url = `${this.API_URL}/get-all?keyword=${keyword}&page=${page}&size=${size}`;
    if (statusId) url += `&statusId=${statusId}`;
    if (roleId) url += `&roleId=${roleId}`;
    return this.http.get<PageResponse<AccountResponse>>(url);
  }

  /**
   * Lấy thông tin chi tiết tài khoản theo ID
   */
  getUserById(id: string): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.API_URL}/id/${id}`);
  }

  /**
   * Lấy thông tin tài khoản theo tên đăng nhập
   */
  getUserByUserName(userName: string): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.API_URL}/userName/${userName}`);
  }

  /**
   * Cập nhật thông tin tài khoản theo ID
   */
  updateUser(id: string, request: AccountUpdateRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API_URL}/update/${id}`, request);
  }

  /**
   * Cập nhật hàng loạt tài khoản
   */
  updateUserBatch(requests: AccountUpdateRequest[]): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API_URL}/update-batch`, requests);
  }

  /**
   * Cập nhật mật khẩu theo ID (chỉ chính chủ)
   */
  updatePassword(id: string, request: AccountUpdateRequest): Observable<{ message: string; id: string }> {
    return this.http.put<{ message: string; id: string }>(`${this.API_URL}/update-password/${id}`, request);
  }

  /**
   * Xoá tài khoản theo ID
   */
  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/delete/${id}`);
  }

  /**
   * Lấy thông tin tài khoản đang đăng nhập
   */
  getMyInfo(): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.API_URL}/get-info`);
  }

  /**
   * Lấy tất cả Role trong hệ thống
   */
  getAllRoles(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(`${this.API_URL}/roles/get-all`);
  }

  /**
   * Lấy các Role đang được sử dụng trong Account
   */
  getRolesInUse(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(`${this.API_URL}/roles/in-use`);
  }

  /**
   * Lấy tất cả Status trong hệ thống
   */
  getAllStatuses(): Observable<StatusResponse[]> {
    return this.http.get<StatusResponse[]>(`${this.API_URL}/status/get-all`);
  }

  /**
   * Lấy các Status đang được sử dụng trong Account
   */
  getStatusesInUse(): Observable<StatusResponse[]> {
    return this.http.get<StatusResponse[]>(`${this.API_URL}/status/in-use`);
  }
}
