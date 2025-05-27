import { Routes } from '@angular/router';
import { RoleGuard } from '../../auth/guards/role.guard';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Role } from '../../core/enums/role.enum';
import { ALL_ROLES } from '../../core/constants/role.constant';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent)
  }
]; 