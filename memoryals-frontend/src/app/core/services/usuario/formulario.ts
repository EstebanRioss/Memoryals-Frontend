import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Formulario {
  private apiUrl = environment.apiUrl + '/users/formulario';

  constructor(private http: HttpClient) {}

    enviarFormulario(data: { name: string; email: string; message: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  
}
