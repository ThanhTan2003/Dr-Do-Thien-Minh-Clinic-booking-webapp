import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserResponse } from '../../../../models/responses/identity/user.response';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

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
  faUser = faUser;

  constructor(private router: Router, private location: Location) {}

  get currentUrl(): string {
    return this.location.path();
  }

  get currentPathSegment(): string {
    const path = this.location.path();
    const segments = path.split('/');
    // Lấy segment thứ 2 sau /admin/ (index 2: ['', 'admin', 'bac-si', ...])
    return segments.length > 2 ? segments[2] : '';
  }

  onMenuSelect(menuId: string, event?: Event) {
    // Chỉ prevent default và navigate nếu là left click (không có modifier keys)
    if (event) {
      const mouseEvent = event as MouseEvent;
      if (!mouseEvent.ctrlKey && !mouseEvent.metaKey && !mouseEvent.shiftKey) {
        event.preventDefault();
        const selectedMenu = this.menuItems.find(item => item.id === menuId);
        if (selectedMenu?.path) {
          this.router.navigate([`/admin/${selectedMenu.path}`]);
        }
      }
    }
    // Nếu có modifier keys (Ctrl, Cmd, Shift), để trình duyệt xử lý mặc định (mở tab mới, v.v.)
    this.menuSelect.emit(menuId);
  }

  onLogout() {
    this.logout.emit();
  }
} 