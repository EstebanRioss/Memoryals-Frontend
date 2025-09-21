import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Pagos {
  private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  // Encabezados con token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // token guardado al loguear
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todos los pagos de un usuario
  getPagosUsuario(userId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/usuario/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Generar el link de pago para la cuota actual
  generarLinkPago(userId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/usuario/${userId}/generar-link`,
      { headers: this.getAuthHeaders() }
    );
  }
}
