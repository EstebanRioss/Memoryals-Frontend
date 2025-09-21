import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class admin{
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token'); // token guardado al hacer login
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // ===================== USUARIOS =====================
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, this.getAuthHeaders());
  }

  getUsuarioById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, this.getAuthHeaders());
  }

  updateUsuario(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data, this.getAuthHeaders());
  }

  deleteUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, this.getAuthHeaders());
  }

  asignarPlan(userId: string, planData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/plan`, planData, this.getAuthHeaders());
  }

  // ===================== PLANES =====================
  getPlanes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/planes`, this.getAuthHeaders());
  }

  getPlanById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/planes/${id}`, this.getAuthHeaders());
  }

  createPlan(plan: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/planes`, plan, this.getAuthHeaders());
  }

  updatePlan(id: string, plan: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/planes/${id}`, plan, this.getAuthHeaders());
  }

  deletePlan(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/planes/${id}`, this.getAuthHeaders());
  }

  // ===================== PAGOS =====================
  getPagosUsuario(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pagos/usuario/${userId}`, this.getAuthHeaders());
  }

  generarLinkPago(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pagos/usuario/${userId}/generar-link`, this.getAuthHeaders());
  }

  // ADMIN - gestión completa de pagos
  getAllPagos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pagos`, this.getAuthHeaders());
  }

  getPagoById(pagoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pagos/${pagoId}`, this.getAuthHeaders());
  }

  updatePago(pagoId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pagos/${pagoId}`, data, this.getAuthHeaders());
  }

  deletePago(pagoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pagos/${pagoId}`, this.getAuthHeaders());
  }
}
