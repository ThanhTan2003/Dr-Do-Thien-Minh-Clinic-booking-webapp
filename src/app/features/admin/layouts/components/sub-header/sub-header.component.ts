import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
export class SubHeaderComponent implements OnInit, OnChanges {
  @Input() menuItems: MenuItem[] = [];
  @Input() parentPath: string = '';
  @Output() menuSelect = new EventEmitter<MenuItem>();

  selectedSubMenuId: string = '';

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.setActiveSubMenu();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['menuItems']) {
      this.setActiveSubMenu();
    }
  }

  setActiveSubMenu() {
    const segments = this.location.path().split('/');
    const subPath = segments[3] || '';
    const active = this.menuItems.find(item => item.path === subPath);
    this.selectedSubMenuId = active?.id || '';
  }

  onMenuSelect(item: MenuItem) {
    this.selectedSubMenuId = item.id;
    this.menuSelect.emit(item);
    if (item.path && this.parentPath) {
      this.router.navigate([`/admin/${this.parentPath}/${item.path}`]);
    }
  }
} 