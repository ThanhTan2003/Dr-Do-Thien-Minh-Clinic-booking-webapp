import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'birthYear', standalone: true })
export class BirthYearPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    return date.getFullYear().toString();
  }
} 