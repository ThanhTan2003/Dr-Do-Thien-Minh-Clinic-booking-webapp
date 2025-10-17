import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { filter } from 'rxjs/operators';
import { AdminMenuItems } from '../../../menu/menu-admin.config';
import { StaffMenuItems } from '../../../menu/menu-staff.config';
import { MarketingMenuItems } from '../../../menu/menu-marketing.config';
import { AuthService } from '../../../auth/services/auth.service';
import { ROLES } from '../../../auth/constants/roles.constant';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  children?: MenuItem[];
}

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, RouterModule, SubHeaderComponent, MainLayoutComponent],
  templateUrl: './main-content.component.html'
})
export class MainContentComponent implements OnInit {
  menuItems: any[] = [];
  selectedMenu: any = null;

  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getAccountInfo().subscribe(user => {
      if (user) {
        this.menuItems = this.loadMenuByRole(user.roleResponse.id);
        this.updateSelectedMenu();
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSelectedMenu();
    });
  }

  loadMenuByRole(roleId: string) {
    switch (roleId) {
      case ROLES.ADMIN: return AdminMenuItems;
      case ROLES.STAFF: return StaffMenuItems;
      case ROLES.MARKETING: return MarketingMenuItems;
      default: return [];
    }
  }

  updateSelectedMenu() {
    const segments = this.location.path().split('/');
    const currentPath = segments[2] || '';
    this.selectedMenu = this.menuItems.find(item => item.path === currentPath) || null;
  }
}