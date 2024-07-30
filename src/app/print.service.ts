// src/app/print.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private printSubject = new BehaviorSubject<boolean>(false);
  printState$ = this.printSubject.asObservable();

  startPrint() {
    this.printSubject.next(true);
  }

  endPrint() {
    this.printSubject.next(false);
  }
}
