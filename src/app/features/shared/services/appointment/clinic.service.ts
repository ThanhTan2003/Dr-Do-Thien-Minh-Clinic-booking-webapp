import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { Clinic } from '../../models/responses/appointment/clinic.model';
import { ClinicRequest } from '../../models/requests/appointment/clinic.request';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  constructor(private http: HttpService) {}

  private readonly API_URL = '/api/v1/appointment/clinic';

  getClinicInfo(): Observable<Clinic> {
    return this.http.get<Clinic>(this.API_URL);
  }

  createOrUpdateClinic(clinicRequest: ClinicRequest): Observable<Clinic> {
    return this.http.post<Clinic>(this.API_URL, clinicRequest);
  }
}
