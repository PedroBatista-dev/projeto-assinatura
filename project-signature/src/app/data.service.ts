import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  enviarResposta(resposta: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}resposta`, { Texto: resposta });
  }

  getUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}usuarios`);
  }
}
