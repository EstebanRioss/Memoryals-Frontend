import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = environment.apiUrl + '/planes';

  constructor(private http: HttpClient) {}

  getPlanes(): Observable<any[]> {
    console.log('Fetching plans from:', this.apiUrl);
    return this.http.get<any[]>(this.apiUrl);
  }
}
