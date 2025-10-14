import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sub-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './sub-header.component.html'
})
export class SubHeaderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() menuItems: MenuItem[] = [];
  @Input() parentPath: string = '';
  @Output() menuSelect = new EventEmitter<MenuItem>();

  selectedSubMenuId: string = '';
  private routerSub?: Subscription;

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.setActiveSubMenu();
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveSubMenu();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['menuItems']) {
      this.setActiveSubMenu();
    }
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  setActiveSubMenu() {
    const segments = this.location.path().split('/');
    let subPath = segments[3] || '';
    if (subPath.includes('?')) {
      subPath = subPath.split('?')[0];
    }
    const active = this.menuItems.find(item => item.path === subPath);
    this.selectedSubMenuId = active?.id || '';
  }

  getMenuHref(item: MenuItem): string {
    if (item.path && this.parentPath) {
      return `/admin/${this.parentPath}/${item.path}`;
    }
    return '#';
  }

  onMenuSelect(item: MenuItem, event?: Event) {
    // Chỉ prevent default và navigate nếu là left click (không có modifier keys)
    if (event) {
      const mouseEvent = event as MouseEvent;
      if (!mouseEvent.ctrlKey && !mouseEvent.metaKey && !mouseEvent.shiftKey) {
        event.preventDefault();
        this.selectedSubMenuId = item.id;
        this.menuSelect.emit(item);
        if (item.path && this.parentPath) {
          this.router.navigate([`/admin/${this.parentPath}/${item.path}`]);
        }
      }
    } else {
      // Fallback cho trường hợp gọi không có event (programmatic)
      this.selectedSubMenuId = item.id;
      this.menuSelect.emit(item);
      if (item.path && this.parentPath) {
        this.router.navigate([`/admin/${this.parentPath}/${item.path}`]);
      }
    }
  }
} 