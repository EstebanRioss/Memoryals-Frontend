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
    aceptaTerminos?: boolean;
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
        // 🔁 Guardar datos en sessionStorage
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('name', res.name);
        sessionStorage.setItem('rol', res.rol);
        sessionStorage.setItem('id', res.id);

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
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('id');

    this.authStatus.next(false);
    this.currentUserSubject.next(null);
  }

  // ----------------------
  // 🔹 Token & headers
  // ----------------------
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getId(): string | null {
    return sessionStorage.getItem('id');
  }

  getUserName(): string | null {
    return sessionStorage.getItem('name');
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('rol');
  }

  isAuthenticated$(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  private getStoredUser() {
    const token = sessionStorage.getItem('token');
    const name = sessionStorage.getItem('name');
    const rol = sessionStorage.getItem('rol');
    const id = sessionStorage.getItem('id');
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
