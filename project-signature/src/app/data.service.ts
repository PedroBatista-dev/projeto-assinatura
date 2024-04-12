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

  enviarResposta(codigo: string, assinatura: string): Observable<any> {
    const resource = { CodigoUsuario: codigo, Assinatura: assinatura.split(",")[1] };
    return this.http.post<any>(`${this.apiUrl}usuarios/gravar-assinatura`, resource);
  }

  getUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}usuarios`);
  }
}
