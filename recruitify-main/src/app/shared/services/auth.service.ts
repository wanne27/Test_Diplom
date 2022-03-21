import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserData, UserResponse } from '../models/User';
import { ApiService } from './api.service';

const API_URL = '';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  constructor(private httpClient: HttpClient) {
    super(httpClient, API_URL, AuthService.name);
  }

  login(user: UserData): Observable<UserResponse> {
    const body = new HttpParams()
      .set('username', user.email)
      .set('password', user.password)
      .set('grant_type', 'password');
    return super.post<UserResponse, any>({ login: true }, body.toString(), {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
  }
  logout(): Observable<{}> {
    return of({});
  }
  jwtDecode(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}
