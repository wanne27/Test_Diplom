import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { paths } from '../app-routing.constants';
import { AppFacade } from '../app.facade';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private appFacade: AppFacade) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.appFacade.getUser$().subscribe((user) => {
      let headers;
      if (user) {
        headers = req.headers.set('Authorization', 'Bearer ' + user.token);
      } else {
        headers = req.headers.set(
          'authorization',
          'Basic cmVjcnVpdGlmeV9hcGk6'
        );
        // .set('Content-type', 'application/x-www-form-urlencoded');
      }

      req = req.clone({ headers });
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log('[Interceptor Error]: ', error);
        if (error.status === 401 && this.router.url !== '/' + paths.login) {
          this.appFacade.logout();
          this.router.navigate([paths.login], {
            // queryParams: {
            //   authFailed: true,
            // },
          });
        }
        return throwError(error);
      })
    );
  }
}
