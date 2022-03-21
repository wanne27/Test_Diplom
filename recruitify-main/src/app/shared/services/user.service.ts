import { Injectable } from '@angular/core';
import { Role, UserRoles } from '../models/UserRoles';
import { LocalStorageService } from './../../services/local-storage.service';

type Roles = keyof typeof Role;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly GLOBAL_ROLE_ID = 'a6cc25ba-3e12-11ec-9bbc-0242ac130002';
  constructor(private localstorage: LocalStorageService) {}

  getUserRoles(): UserRoles[] {
    try {
      return this.localstorage.getItem('user').roles;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  getGlobalRoles(): Roles[] | undefined {
    const roles = this.getUserRoles();
    return roles.find((r) => r.projectId === this.GLOBAL_ROLE_ID)?.roles;
  }

  checkGlobalRole(role: Roles | Roles[]): boolean {
    const globalRoles = this.getGlobalRoles();
    if (Array.isArray(role)) {
      let count = 0;
      role.forEach((r) => {
        if (globalRoles?.includes(r)) {
          ++count;
        }
      });
      console.log(count);
      return count === role.length;
    } else {
      if (globalRoles) {
        return globalRoles.includes(role);
      }
    }
    return false;
  }
  isAdmin(): boolean {
    return this.checkGlobalRole('Admin');
  }
  isManager(): boolean {
    return this.checkGlobalRole('Manager');
  }
  isRecruiter(): boolean {
    return this.checkGlobalRole('Recruiter');
  }
  isInterviewer(): boolean {
    return this.checkGlobalRole('Interviewer');
  }
  isMentor(): boolean {
    return this.checkGlobalRole('Mentor');
  }

  checkRoleInProject(projectId: string, role: Roles): boolean {
    const projectRoles = this.getProjectRoles(projectId);
    return projectRoles?.includes(role) || false;
  }

  getProjectRoles(projectId: string): Roles[] | undefined {
    const roles = this.getUserRoles();
    return roles.find((r) => r.projectId === projectId)?.roles;
  }
}
