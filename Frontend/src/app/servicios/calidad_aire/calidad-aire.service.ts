import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//Servicio para interactuar con la API de calidad del aire
@Injectable({
  // Inyectar HttpClient
  providedIn: 'root'
})
//Clase del servicio
export class CalidadAireService {
  //URL de la API backend
  private apiUrl = 'http://localhost:8000/api';
  //Inyectar HttpClient
  constructor(private http: HttpClient) {}

  //PARA EL DASHBOARD
  getDashboard(): Observable<any> { return this.http.get(`${this.apiUrl}/dashboard`); }
  getCO(): Observable<any> { return this.http.get(`${this.apiUrl}/co`); }
  getNOx(): Observable<any> { return this.http.get(`${this.apiUrl}/nox`); }
  getSOx(): Observable<any> { return this.http.get(`${this.apiUrl}/sox`); }
  getPM10(): Observable<any> { return this.http.get(`${this.apiUrl}/pm10`); }
  getPM25(): Observable<any> { return this.http.get(`${this.apiUrl}/pm25`); }

  //PARA GRAFICAR ULTIMOS REGISTROS
  getLatest(limit: number = 10): Observable<any> {
  return this.http.get(`${this.apiUrl}/device/latest?limit=${limit}`);
  }
  //PARA GRAFICAR TODOS LOS REGISTROS
  getAll(): Observable<any> {
    return this.http.get('http://localhost:8000/api/device/all');
  }

}
