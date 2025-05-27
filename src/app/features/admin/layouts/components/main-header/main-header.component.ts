import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserResponse } from '../../../../models/responses/identity/user.response';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './main-header.component.html'
})
export class MainHeaderComponent {
  @Input() currentUser: UserResponse | null = null;
  @Input() menuItems: any[] = [];
  @Output() menuSelect = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  faRightFromBracket = faRightFromBracket;

  constructor(private router: Router, private location: Location) {}

  get currentUrl(): string {
    return this.location.path();
  }

  onMenuSelect(menuId: string) {
    const selectedMenu = this.menuItems.find(item => item.id === menuId);
    if (selectedMenu?.path) {
      this.router.navigate([`/admin/${selectedMenu.path}`]);
    }
    this.menuSelect.emit(menuId);
  }

  onLogout() {
    this.logout.emit();
  }
} 