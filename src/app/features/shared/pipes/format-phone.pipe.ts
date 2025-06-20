import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatPhone', standalone: true })
export class FormatPhonePipe implements PipeTransform {
  transform(phone: string): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    const match = digits.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  }
} 