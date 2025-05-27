import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { AuthService } from '../auth/services/auth.service';
import { UserResponse } from '../../models/responses/identity/user.response';
import { AdminMenuItems } from '../menu/menu-admin.config';
import { StaffMenuItems } from '../menu/menu-staff.config';
import { MarketingMenuItems } from '../menu/menu-marketing.config';
import { ROLES } from '../auth/constants/roles.constant';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MainHeaderComponent,
    SubHeaderComponent,
    MainLayoutComponent,
    MainContentComponent
  ],
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  currentUser: UserResponse | null = null;
  menuItems: any[] = [];
  selectedMenuId: string = '';
  selectedMenu: any = null;
  showSubHeader = false;
  homePath: string | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("Lay thong tin nguoi dung 2");
    this.authService.getUserInfo().subscribe(user => {
      console.log("Lay thong tin nguoi dung thanh cong");
      if (user) {
        this.currentUser = user;
        this.loadMenuByRole(user.roleId);
        // Lấy path của menu Trang chủ sau khi load menu
        const homeMenu = this.menuItems.find(item => item.label === 'Trang chủ');
        this.homePath = homeMenu?.path;
        // Set mặc định selectedMenu là Trang chủ
        this.selectedMenu = homeMenu || null;
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const currentPath = event.url.split('/')[2];
      if (currentPath === this.homePath) {
        this.showSubHeader = false;
      } else {
        const currentMenu = this.menuItems.find(item => item.path === currentPath);
        this.showSubHeader = currentMenu?.children?.length > 0;
        this.selectedMenu = currentMenu || null;
      }
    });
  }

  private loadMenuByRole(roleId: string) {
    switch(roleId) {
      case ROLES.ADMIN:
        this.menuItems = AdminMenuItems;
        break;
      case ROLES.STAFF:
        this.menuItems = StaffMenuItems;
        break;
      case ROLES.MARKETING:
        this.menuItems = MarketingMenuItems;
        break;
      default:
        this.menuItems = [];
    }
  }

  onMenuSelect(menuId: string) {
    this.selectedMenuId = menuId;
    const selectedMenu = this.menuItems.find(item => item.id === menuId);
    this.selectedMenu = selectedMenu || null;
    if (selectedMenu?.path === this.homePath) {
      this.showSubHeader = false;
    } else {
      this.showSubHeader = selectedMenu?.children?.length > 0;
    }
  }

  onLogout() {
    this.authService.logout();
  }
}