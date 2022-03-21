import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { paths } from './app-routing.constants';
import { LocalStorageService } from './services/local-storage.service';
import { User, UserData, UserResponse } from './shared/models/User';
import { AuthService } from './shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  public readonly INITIAL_PATH = paths.projects;
  public readonly USER_KEY = 'user';

  private user: User | undefined;

  constructor(
    private lsService: LocalStorageService,
    private router: Router,
    private auth: AuthService,
    private message: NzMessageService
  ) {}
  isUserLoading$ = new BehaviorSubject<boolean>(false);
  userAuthError$ = new BehaviorSubject<boolean>(false);

  isAuthenticated$(): Observable<boolean> {
    return this.getUser$().pipe(
      map((user) => !!user),
      catchError(() => of(false))
    );
  }

  getUser$(): Observable<User | null> {
    // console.log('getUser');
    if (this.user) {
      return of(this.user);
    }
    const user = this.lsService.getItem<User>(this.USER_KEY);
    return of(user);
  }

  initUserFromStorage() {}

  login(user: UserData) {
    this.isUserLoading$.next(true);
    this.auth.login(user).subscribe(
      (response: UserResponse) => {
        const decodedUser: User = this.auth.jwtDecode(response.access_token);
        // console.log(decodedUser);
        this.user = {
          email: user.email,
          token: response.access_token,
          roles: decodedUser.role,
          name: decodedUser.name,
        };
        this.lsService.setItem(this.USER_KEY, this.user);
        this.router.navigate([this.INITIAL_PATH]);
        this.message.success('Login successful');
        this.isUserLoading$.next(false);
      },
      (error) => {
        this.message.error('Wrong email or password!');
        console.log(error);
        this.isUserLoading$.next(false);
        this.userAuthError$.next(true);
      }
    );
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.lsService.removeItem(this.USER_KEY);
      this.router.navigate([paths.login]);
      this.user = undefined;
    });
  }
}
