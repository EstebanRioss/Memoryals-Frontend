import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  message: string;
  token: string;
  name: string;
  rol: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = environment.apiUrl + '/users';

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ======================
  // 🔹 REGISTER
  // ======================
  register(userData: {
    nombre: string;
    email: string;
    password: string;
    dni: string;
    rol?: string;
    direccion?: string;
    telefono?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // ======================
  // 🔹 CONFIRM EMAIL (token enviado por correo)
  // ======================
  confirmEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirmar/${token}`);
  }

  // ======================
  // 🔹 LOGIN
  // ======================
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('name', res.name);
          localStorage.setItem('rol', res.rol);
          localStorage.setItem('id', res.id);
          
          this.authStatus.next(true);
          this.currentUserSubject.next({
            name: res.name,
            rol: res.rol,
            token: res.token,
            id: res.id
          });
        })
      );
  }

  // ======================
  // 🔹 LOGOUT
  // ======================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('rol');
    localStorage.removeItem('id');

    this.authStatus.next(false);
    this.currentUserSubject.next(null);
  }

  // ======================
  // 🔹 TOKEN & SESSION
  // ======================
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getId(): string | null {
    return localStorage.getItem('id');
  }

  getUserName(): string | null {
    return localStorage.getItem('name');
  }

  getUserRole(): string | null {
    return localStorage.getItem('rol');
  }

  isAuthenticated$(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUser() {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const rol = localStorage.getItem('rol');
    return token ? { name, rol, token } : null;
    
  }
}
