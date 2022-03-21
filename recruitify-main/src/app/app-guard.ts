import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { paths } from './app-routing.constants';
import { AppFacade } from './app.facade';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private router: Router, private appFacade: AppFacade) {}

  canActivate(): Observable<boolean> {
    return this.appFacade.isAuthenticated$().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate([paths.login]);
        }
      })
    );
  }
}
