import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormatService {
  formatDate(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('vi-VN');
  }
  formatDateTime(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
  birthYear(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    return date.getFullYear().toString();
  }
  formatPhone(phone: string): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    const match = digits.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) return `${match[1]} ${match[2]} ${match[3]}`;
    return phone;
  }
}
