import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:1337/api';  

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
  
  updateItem(endpoint: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;  // No need to pass the ID separately in the URL
    return this.http.put<any>(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  
  
  
  // async updateById(table: any, id: number, updatedclasse: any): Promise<any> {
  //   const url = `${this.apiUrl}/${table}/${id}`;
  //   try {
  //     const response = await this.http.put<any>(url, updatedclasse).toPromise();
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  
  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
