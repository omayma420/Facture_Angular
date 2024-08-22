import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:1337'; 

  constructor(private http: HttpClient) {}

 
  getItems(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  getItemById(endpoint: string, id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}/${id}`);
  }


  createItem(endpoint: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, JSON.stringify(data), { headers });
  }

  updateItem(endpoint: string, id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  deleteItem(endpoint: string, id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${endpoint}/${id}`);
  }

    callApi(endpoint: string): Observable<any> {
    return this.getItems(endpoint);
  }
}
