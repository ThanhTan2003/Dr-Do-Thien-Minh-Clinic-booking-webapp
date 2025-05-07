import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  private doctorServiceState: { [doctorId: string]: { currentPage: number; keyword: string } } = {};

  setDoctorServiceState(doctorId: string, currentPage: number, keyword: string): void {
    this.doctorServiceState[doctorId] = { currentPage, keyword };
  }

  getDoctorServiceState(doctorId: string): { currentPage: number; keyword: string } | null {
    return this.doctorServiceState[doctorId] || null;
  }

  clearDoctorServiceState(doctorId: string): void {
    delete this.doctorServiceState[doctorId];
  }
}