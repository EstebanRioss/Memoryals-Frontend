import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ChatResponse {
  reply?: string;
  history?: any[];
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl + '/chat';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  sendMessage(userId: string, message: string, token: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(
      this.apiUrl,
      { userId, message },
      this.headers(token)
    ).pipe(
      catchError(err => throwError(() => new Error(err.error?.error || 'Error en el servidor')))
    );
  }

  cargarChatHistory(userId: string, token: string): Observable<ChatResponse> {
    return this.http.get<ChatResponse>(
      `${this.apiUrl}/${userId}`,
      this.headers(token)
    ).pipe(
      catchError(err => throwError(() => new Error(err.error?.error || 'Error al cargar el historial')))
    );
  }

  deleteChatHistory(userId: string, token: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${userId}`,
      this.headers(token)
    ).pipe(
      catchError(err => throwError(() => new Error(err.error?.error || 'Error al eliminar el historial')))
    );
  }
}
