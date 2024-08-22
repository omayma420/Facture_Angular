import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CdkDragMove, CdkDragEnd, CdkDragDrop } from '@angular/cdk/drag-drop';
import { PrintService } from 'src/app/print.service';
import { FactureService } from './facture.service';
import { ViewChildren, QueryList } from '@angular/core';

interface FactureItems {
  id: number;
  reference: string;
  designation: string;
  quantity: number;
  pricePerUnitHT: number;
  tva: number;
  remise: number;
  total: number;
}

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit, AfterViewInit {

  data: any;

  @ViewChildren('borderedbox, column, customtable, containerbig, exampleebox') elements!: QueryList<ElementRef>;

  clientInfo = ['id', 'Télephone:', 'client:', 'code client:', 'CTVA:', 'Adresse:'];
  companyInfo = ['id', 'Email:', 'Télephone:', 'CTVA:', 'Adresse:'];
  companyInfoPosition = { top: 0, left: 0 };
  clientInfoPosition = { top: 0, left: 0 };

  @ViewChild('companyInfo') companyInfoElement!: ElementRef;
  @ViewChild('clientInfoElement') clientInfoElement!: ElementRef;
  @ViewChild('exampleBox') exampleBox!: ElementRef;
  @ViewChild('examplexBox') examplexBox!: ElementRef;
  @ViewChild('customTable') customTable!: ElementRef;
  @ViewChild('exampleeBox') exampleeBox!: ElementRef;

  backgroundColor: string = '#ffffff';
  fontSize: number = 12;
  textColor: string = '#000000';

  factureItems: FactureItems[] = [
    { id: 1, reference: 'REF001', designation: 'Produit A', quantity: 10, pricePerUnitHT: 100, tva: 20, remise: 5, total: 950 },
  ];

  totalRemise: number = 0;
  items: string[] = [];
  visible: boolean = false;
  factureDialog: boolean = false;
  showContent: boolean = true;
  currentDate: Date = new Date();
  sumoffodec: number = 78;
  consult: boolean = false;

  a4Width: number = 793;
  a4Height: number = 1500;

  private startPosition: { x: number; y: number } = { x: 0, y: 0 };
  remarque: any;
  containerBig: any;
  box: any;

  constructor(private printService: PrintService, private factureService: FactureService) {}

  ngOnInit(): void {
    this.loadDesignSettings();
    this.calculateTotalRemise();
    this.items = JSON.parse(localStorage.getItem('items') || '[]') || this.companyInfo;
    this.loadElementPositions();
    this.applySavedPositions();
  }

  ngAfterViewInit(): void {}

fetchItems(): void {
  console.log(this.data)
 
  this.factureService.createItem('api/api/facture-proprietes', this.data) 
    .subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
        // Afficher un message d'erreur plus spécifique ou une propriété de l'objet d'erreur
        if (error.status) {
          console.error(`Status: ${error.status}, Message: ${error.message}`);
        }
      }
    });
}


  applySavedPositions(): void {
    this.applyPosition(this.companyInfoElement, 'companyInfoPosition');
    this.applyPosition(this.clientInfoElement, 'clientInfoPosition');
  }

  private applyPosition(elementRef: ElementRef | undefined, key: string): void {
    const savedPosition = localStorage.getItem(key);
    if (savedPosition && elementRef?.nativeElement) {
      const position = JSON.parse(savedPosition);
      elementRef.nativeElement.style.position = 'absolute';
      elementRef.nativeElement.style.top = `${position.top}px`;
      elementRef.nativeElement.style.left = `${position.left}px`;
    }
  }

  changeBackgroundColor(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.backgroundColor = input.value;
      this.saveDesignSettings();
    }
  }

  changeTextColor(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.textColor = input.value;
      this.saveDesignSettings();
    }
  }

  calculateTotalRemise(): void {
    const totalRemise = this.factureItems.reduce((acc, item) => acc + item.remise, 0);
    this.totalRemise = totalRemise / this.factureItems.length;
  }

  saveDesignSettings(): void {
    localStorage.setItem('backgroundColor', this.backgroundColor);
    localStorage.setItem('fontSize', this.fontSize.toString());
    localStorage.setItem('textColor', this.textColor);
  }

  loadDesignSettings(): void {
    this.backgroundColor = localStorage.getItem('backgroundColor') || this.backgroundColor;
    this.fontSize = parseInt(localStorage.getItem('fontSize') || this.fontSize.toString(), 10);
    this.textColor = localStorage.getItem('textColor') || this.textColor;
  }

  saveElementPositions(): void {
    const elements = [
      { name: 'exampleBox', element: this.exampleBox },
      { name: 'examplexBox', element: this.examplexBox },
      { name: 'customTable', element: this.customTable },
      { name: 'exampleeBox', element: this.exampleeBox }
    ];

    elements.forEach(({ name, element }) => {
      if (element.nativeElement) {
        const position = element.nativeElement.getBoundingClientRect();
        localStorage.setItem(`${name}_top`, position.top.toString());
        localStorage.setItem(`${name}_left`, position.left.toString());
      }
    });
  }

  loadElementPositions(): void {
    const elements = [
      { name: 'exampleBox', element: this.exampleBox },
      { name: 'examplexBox', element: this.examplexBox },
      { name: 'customTable', element: this.customTable },
      { name: 'exampleeBox', element: this.exampleeBox }
    ];

    elements.forEach(({ name, element }) => {
      const savedCoordinates = JSON.parse(localStorage.getItem('elementCoordinates') || '{}');
      const coordinates = savedCoordinates[name];

      if (coordinates) {
        element.nativeElement.style.transform = `translate(${coordinates.x}px, ${coordinates.y}px)`;
      }
    });
  }

  getCoordinates(): void {
    this.elements.forEach(element => {
      const rect = element.nativeElement.getBoundingClientRect();
      const coordinates = {
        name:"ghcf",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      };
      console.log('Coordonnées de l\'élément:', coordinates);
      this.data={data:coordinates}
    });
  }

  onDragEnd(event: CdkDragEnd, element: HTMLDivElement): void {
    const rect = element.getBoundingClientRect();
    const coordinates = {
      
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };
    console.log('Nouvelles coordonnées après déplacement:', coordinates);
  }

  onDragMove(event: CdkDragMove<any>): void {
    const element = event.source.element.nativeElement;
    const parent = element.parentElement;

    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Calcul des limites pour le déplacement
    const minX = 0;
    const maxX = parentRect.width - elementRect.width;
    const minY = 0;
    const maxY = parentRect.height - elementRect.height;

    // Calculer les nouvelles positions
    let newX = elementRect.left - parentRect.left + event.delta.x;
    let newY = elementRect.top - parentRect.top + event.delta.y;

    // Limiter les positions à l'intérieur des bornes du conteneur
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    // Appliquer les transformations
    element.style.transform = `translate(${newX}px, ${newY}px)`;

    // Optionnel : Sauvegarder les coordonnées pour une utilisation ultérieure
    this.saveCoordinatesToLocalStorage(element, { x: newX, y: newY });
  }

  drop(event: CdkDragDrop<FactureItems[]>): void {
    const element = event.item.element.nativeElement;
    const transform = window.getComputedStyle(element).transform;
    let finalX = 0, finalY = 0;

    if (transform !== 'none') {
      const matrix = new DOMMatrix(transform);
      finalX = matrix.m41;
      finalY = matrix.m42;
    }

    const coordinates = { x: finalX, y: finalY };
    console.log('Final coordinates:', coordinates);

    // Sauvegarder les coordonnées finales dans le localStorage
    this.saveCoordinatesToLocalStorage(element, coordinates);
  }

  saveCoordinatesToLocalStorage(element: HTMLElement, coordinates: { x: number; y: number }): void {
    const savedCoordinates = JSON.parse(localStorage.getItem('elementCoordinates') || '{}');
    const elementId = element.id;
    savedCoordinates[elementId] = coordinates;
    localStorage.setItem('elementCoordinates', JSON.stringify(savedCoordinates));
  }

  printInvoice(): void {
    window.print();
  }
}
