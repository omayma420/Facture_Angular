import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CdkDragMove, CdkDragStart, CdkDragEnd, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PrintService } from 'src/app/print.service';
import { FactureService } from './facture.service';



interface factureItems {
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
  clientInfo = ['Télephone:', 'client:', 'code client:', 'CTVA:', 'Adresse:'];
  companyInfo = ['Email:', 'Télephone:', 'CTVA:', 'Adresse:'];
  companyInfoPosition = { top: 0, left: 0 };
  clientInfoPosition = { top: 0, left: 0 };

  @ViewChild('companyInfo') companyInfoElement!: ElementRef;
  @ViewChild('clientInfo') clientInfoElement!: ElementRef;

  backgroundColor: string = '#ffffff';
  fontSize: number = 12;
  textColor: string = '#000000';

  factureItems: factureItems[] = [
    { id: 1,reference: 'REF001', designation: 'Produit A', quantity: 10, pricePerUnitHT: 100, tva: 20, remise: 5, total: 950 },
    { id: 1,reference: 'REF002', designation: 'Produit B', quantity: 5, pricePerUnitHT: 200, tva: 20, remise: 10, total: 900 }
  ];

  totalRemise: number = 0;
  items: string[] = [];
  visible: boolean = false;
  factureDialog: boolean = false;
  showContent: boolean = true;
  currentDate: Date = new Date();
  sumoffodec: number = 78;
  consult: boolean = false;

  @ViewChild('exampleBox') exampleBox!: ElementRef;
  @ViewChild('examplexBox') examplexBox!: ElementRef;
  @ViewChild('customTable') customTable!: ElementRef;
  @ViewChild('exampleeBox') exampleeBox!: ElementRef;

  a4Width: number = 793; // Largeur d'une page A4 en pixels (à 96 DPI)
  a4Height: number = 1500; // Hauteur d'une page A4 en pixels (à 96 DPI)

  private startPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private printService: PrintService, private factureService: FactureService) {}

  ngOnInit(): void {
    this.loadDesignSettings();
    this.calculateTotalRemise();
    this.items = JSON.parse(localStorage.getItem('items') || '[]') || this.companyInfo;
    // this.loadItemPositions();
    this.loadElementPositions();
    this.applySavedPositions();
  }

  ngAfterViewInit(): void {
    this.loadElementPositions();
    this.adjustPositions();
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
  saveFactureItems(): void {
    // Dimensions d'une page A4 en pixels (environ)
    const pageWidth = 794; 
    const pageHeight = 1123;
  
    // Mettre à jour les dimensions pour chaque élément de facture
    this.factureItems = this.factureItems.map(item => {
      const element = document.getElementById(`facture-item-${item.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
  
        // Coordonnées relatives à la page A4
        const topRelativeToA4 = rect.top <= pageHeight ? rect.top : rect.top % pageHeight;
        const leftRelativeToA4 = rect.left <= pageWidth ? rect.left : rect.left % pageWidth;
  
        return {
          ...item,
          top: topRelativeToA4,
          left: leftRelativeToA4,
          height: rect.height,
          width: rect.width
        };
      }
      return item;
    });
  
    // Sauvegarder les éléments dans le localStorage ou appeler un service API
    localStorage.setItem('factureItems', JSON.stringify(this.factureItems));
    console.log('Facture items with dimensions relative to A4 saved', this.factureItems);
  }
  

  loadElementPositions(): void {
    const elements = [
      { name: 'exampleBox', element: this.exampleBox },
      { name: 'examplexBox', element: this.examplexBox },
      { name: 'customTable', element: this.customTable },
      { name: 'exampleeBox', element: this.exampleeBox }
    ];

    elements.forEach(({ name, element }) => {
      if (element.nativeElement) {
        const savedTop = localStorage.getItem(`${name}_top`);
        const savedLeft = localStorage.getItem(`${name}_left`);
        const savedHeight = localStorage.getItem(`${name}_height`);
        const savedWidth = localStorage.getItem(`${name}_width`);

        if (savedTop && savedLeft) {
          element.nativeElement.style.position = 'absolute';
          element.nativeElement.style.top = `${savedTop}px`;
          element.nativeElement.style.left = `${savedLeft}px`;
        }

        if (savedHeight && savedWidth) {
          element.nativeElement.style.height = `${savedHeight}px`;
          element.nativeElement.style.width = `${savedWidth}px`;
        }
      }
    });
  }

  checkOverlap(element1: HTMLElement, element2: HTMLElement): boolean {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
  }

  adjustPositions(): void {
    const elements = [
      this.exampleBox.nativeElement,
      this.examplexBox.nativeElement,
      this.customTable.nativeElement,
      this.exampleeBox.nativeElement
    ];

    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        if (this.checkOverlap(elements[i], elements[j])) {
          elements[j].style.top = `${parseInt(elements[j].style.top) + 20}px`;
          elements[j].style.left = `${parseInt(elements[j].style.left) + 20}px`;
        }
      }
    }
  }

  onDragMove(event: CdkDragMove): void {
    const element = event.source.element.nativeElement;
    const parent = element.parentElement;

    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const minX = parentRect.left;
    const maxX = minX + this.a4Width - elementRect.width;
    const minY = parentRect.top;
    const maxY = parentRect.bottom - elementRect.height;

    const currentTransform = element.style.transform;
    let currentX = 0, currentY = 0;

    const translateValues = currentTransform.match(/translate\(([^)]+)\)/);
    if (translateValues && translateValues[1]) {
      const [x, y] = translateValues[1].split(',').map(val => parseFloat(val.trim()));
      currentX = x;
      currentY = y;
    }

    const deltaX = event.delta.x + currentX;
    const deltaY = event.delta.y + currentY;

    const limitedX = Math.max(minX - this.startPosition.x, Math.min(deltaX, maxX - this.startPosition.x));
    const limitedY = Math.max(minY - this.startPosition.y, Math.min(deltaY, maxY - this.startPosition.y));

    element.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
  }
  drop(event: CdkDragDrop<factureItems[]>): void {
    // Gestion du drop des éléments
    console.log('Element dropped:', event);
  }
  printInvoice(): void {
    // Code pour imprimer la facture
    console.log('Printing invoice...');
  }


}
