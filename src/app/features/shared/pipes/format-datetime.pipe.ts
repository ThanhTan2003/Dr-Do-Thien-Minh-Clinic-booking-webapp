import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDateTime', standalone: true })
export class FormatDateTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 