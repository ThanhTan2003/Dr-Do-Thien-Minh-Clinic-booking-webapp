import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollPositionService {
  private positions: { [key: string]: number } = {};

  setPosition(key: string, pos: number) {
    this.positions[key] = pos;
  }

  getPosition(key: string): number {
    return this.positions[key] || 0;
  }
} 