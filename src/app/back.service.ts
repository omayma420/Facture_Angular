
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class BackService {
  private apiUrl = 'http://localhost:1337/Facture-propriete'; // Changez cette URL en fonction de votre backend

  constructor(private http: HttpClient) {}

  saveDimensions(width: number, height: number) {
    return this.http.post(this.apiUrl, { width, height });
  }
}
