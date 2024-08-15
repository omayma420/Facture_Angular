import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:1337/Facture-propriete'; 

  constructor(private http: HttpClient) {}

  // Sauvegarder les éléments de facture
  saveFactureItems(updatedItems: {
    height: number;
    width: number;
    reference: string;
    designation: string;
    quantity: number;
    pricePerUnitHT: number;
    tva: number;
    remise: number;
    total: number;
  }[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, updatedItems);
  }

  // Sauvegarder les positions dans le localStorage
  savePositionToLocalStorage(elementName: string, position: any): void {
    let positions = JSON.parse(localStorage.getItem('elementPositions') || '{}');
    positions[elementName] = position;
    localStorage.setItem('elementPositions', JSON.stringify(positions));
  }

  // Charger les positions depuis le localStorage
  loadPositionsFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem('elementPositions') || '{}');
  }
}
