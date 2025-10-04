import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface LoginResponse {
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

  // ----------------------
  // 🔹 Registro
  // ----------------------
  register(userData: {
    nombre: string;
    email: string;
    password: string;
    dni: string;
    rol?: string;
    direccion?: string;
    telefono?: string;
    planId?: string;
    Monto?: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // ----------------------
  // 🔹 Confirmar email
  // ----------------------
  confirmEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirmar/${token}`);
  }

  // ----------------------
  // 🔹 Login
  // ----------------------
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
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

  // ----------------------
  // 🔹 Logout
  // ----------------------
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('rol');
    localStorage.removeItem('id');

    this.authStatus.next(false);
    this.currentUserSubject.next(null);
  }

  // ----------------------
  // 🔹 Token & headers
  // ----------------------
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
    const id = localStorage.getItem('id');
    return token ? { name, rol, token, id } : null;
  }

  // ----------------------
  // 🔹 Headers con token
  // ----------------------
  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    };
  }

  // ----------------------
  // 🔹 Perfil del usuario
  // ----------------------
  getPerfil(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.authHeaders());
  }

  // ----------------------
  // 🔹 Cambiar contraseña
  // ----------------------
  cambiarPassword(id: string, data: { contrasenaActual: string; nuevaContrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cambiar-contrasena`, data, this.authHeaders());
  }

  // ----------------------
  // 🔹 Admin: obtener todos los usuarios
  // ----------------------
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, this.authHeaders());
  }

  // ----------------------
  // 🔹 Admin: obtener usuario por ID
  // ----------------------
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.authHeaders());
  }

  // ----------------------
  // 🔹 Admin: actualizar usuario
  // ----------------------
  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.authHeaders());
  }

  // ----------------------
  // 🔹 Admin: eliminar usuario
  // ----------------------
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.authHeaders());
  }
}
