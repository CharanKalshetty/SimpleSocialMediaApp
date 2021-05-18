import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, ModuleWithComponentFactories } from "@angular/core";
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL+"/user";

@Injectable({providedIn: 'root'})
export class AuthService {

  authenticated=false;
  private token:string;
  private tokenTimmer: NodeJS.Timer;
  private userId: string;
  private authSatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.authenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authSatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post(BACKEND_URL+"/signup", authData).subscribe(() => {
      this.router.navigate(['/login']);
    }, error => {
      this.authSatusListener.next(false);
    });
  }

  Login(email:string, password:string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token:string, expiresIn: number, userId: string}>(BACKEND_URL+"/login", authData).subscribe(response=>{
    this.token=response.token;
    if (response.token) {
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.authenticated=true;
      this.userId=response.userId;
      this.authSatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + (expiresInDuration*1000));
      this.saveAuthData(response.token, expirationDate, this.userId);
      this.router.navigate(['/']);
    }
    }, error => {
      this.authSatusListener.next(false);
    });
  }

  autoAuthUser() {
    const authInformation=this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn=authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn>0) {
      this.token = authInformation.token;
      this.authenticated=true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn/1000)
      this.authSatusListener.next(true);
    }
  }

  logout() {
    this.token=null;
    this.authenticated=false;
    this.authSatusListener.next(false);
    this.userId=null;
    clearTimeout(this.tokenTimmer);
    this.clearAuthData();

    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimmer=setTimeout(()=>{
      this.logout();
    }, duration*1000);
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private getAuthData()  {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
