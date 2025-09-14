import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// 📌 Tipado de la respuesta del backend
export interface ChatResponse {
  reply: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl + '/chat';

  constructor(private http: HttpClient) {}

  sendMessage(userId: string, message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { userId, message }).pipe(
      map((res) => res),
      catchError((err) => {
        console.error('❌ Error en ChatService:', err);
        return throwError(() => new Error(err.error?.error || 'Error en el servidor'));
      })
    );
  }
  cargarChatHistory(userId: string): Observable<ChatResponse[]> {
    return this.http.get<ChatResponse[]>(`${this.apiUrl}/${userId}`).pipe(
      map((res) => res),
      catchError((err) => {
        console.error('❌ Error al cargar el historial de chat:', err);
        return throwError(() => new Error(err.error?.error || 'Error al cargar el historial de chat'));
      })
    );
  }

  deleteChatHistory(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${userId}`).pipe(
      map((res) => res),
      catchError((err) => {
        console.error('❌ Error al eliminar el historial de chat:', err);
        return throwError(() => new Error(err.error?.error || 'Error al eliminar el historial de chat'));
      })
    );
  }
}
