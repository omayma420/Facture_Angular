import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CdkDragMove, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { PrintService } from 'src/app/print.service';

// Interface FactureItem
interface FactureItem {
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
  backgroundColor: string = '#ffffff';
  fontSize: number = 12;
  textColor: string = '#000000';

  factureItems: FactureItem[] = [
    {
      reference: 'REF001',
      designation: 'Produit A',
      quantity: 10,
      pricePerUnitHT: 100,
      tva: 20,
      remise: 5,
      total: 950
    },
    {
      reference: 'REF002',
      designation: 'Produit B',
      quantity: 5,
      pricePerUnitHT: 200,
      tva: 20,
      remise: 10,
      total: 900
    }
  ];

  totalRemise: number = 0;

  visible: boolean = false;
  factureDialog: boolean = false;
  showContent: boolean = true;
  companyInfo: any = {
    name: 'Company Name',
    email: 'email@example.com'
  };

  ClientInfo: any = {
    clientcode: '12345'
  };

  currentDate: Date = new Date();
  sumoffodec: number = 78;
  consult: boolean = false;

  @ViewChild('exampleBox') exampleBox!: ElementRef;
  @ViewChild('examplexBox') examplexBox!: ElementRef;
  @ViewChild('customTable') customTable!: ElementRef;
  @ViewChild('exampleeBox') exampleeBox!: ElementRef;

  // A4 page width in pixels (at 96 DPI)
  a4Width: number = 793;

  // Position de départ
  private startPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private printService: PrintService) {}

  ngOnInit() {
    this.loadDesignSettings();
    this.calculateTotalRemise();
  }

  ngAfterViewInit() {
    // Load positions after view has been initialized
    this.loadElementPositions();
  }

  changeBackgroundColor(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.backgroundColor = input.value;
      this.saveDesignSettings();
    }
  }

  changeTextColor(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.textColor = input.value;
      this.saveDesignSettings();
    }
  }

  calculateTotalRemise() {
    const totalRemise = this.factureItems.reduce((acc, item) => acc + item.remise, 0);
    this.totalRemise = totalRemise / this.factureItems.length;
  }

  saveDesignSettings() {
    localStorage.setItem('backgroundColor', this.backgroundColor);
    localStorage.setItem('fontSize', this.fontSize.toString());
    localStorage.setItem('textColor', this.textColor);
  }

  loadDesignSettings() {
    const savedBackgroundColor = localStorage.getItem('backgroundColor');
    const savedFontSize = localStorage.getItem('fontSize');
    const savedTextColor = localStorage.getItem('textColor');

    if (savedBackgroundColor) {
      this.backgroundColor = savedBackgroundColor;
    }
    if (savedFontSize) {
      this.fontSize = parseInt(savedFontSize, 10);
    }
    if (savedTextColor) {
      this.textColor = savedTextColor;
    }
  }

  saveElementPosition(elementName: string, element: HTMLElement) {
    // Save the position of an element to localStorage
    const rect = element.getBoundingClientRect();
    const parentRect = element.parentElement?.getBoundingClientRect() || { top: 0, left: 0 };
    const top = rect.top - parentRect.top;
    const left = rect.left - parentRect.left;

    localStorage.setItem(`${elementName}_top`, top.toString());
    localStorage.setItem(`${elementName}_left`, left.toString());
  }

  loadElementPositions() {
    // Load positions from localStorage
    const elements = [
      { name: 'exampleBox', element: this.exampleBox },
      { name: 'examplexBox', element: this.examplexBox },
      { name: 'customTable', element: this.customTable },
      { name: 'exampleeBox', element: this.exampleeBox }
    ];

    elements.forEach(({ name, element }) => {
      if (element && element.nativeElement) {
        const savedTop = localStorage.getItem(`${name}_top`);
        const savedLeft = localStorage.getItem(`${name}_left`);

        if (savedTop && savedLeft) {
          element.nativeElement.style.position = 'absolute';
          element.nativeElement.style.top = `${savedTop}px`;
          element.nativeElement.style.left = `${savedLeft}px`;
        }
      }
    });
  }

  onDragMove(event: CdkDragMove) {
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

  onDragStart(event: CdkDragStart) {
    const element = event.source.element.nativeElement;
    const rect = element.getBoundingClientRect();

    this.startPosition = { x: rect.left, y: rect.top };
  }

  onDragEnd(event: CdkDragEnd) {
    const element = event.source.element.nativeElement;
    const transform = element.style.transform;

    const translateValues = transform.match(/translate\(([^)]+)\)/);
    if (translateValues && translateValues[1]) {
      const [x, y] = translateValues[1].split(',').map(val => parseFloat(val.trim()));
      const newLeft = this.startPosition.x + x;
      const newTop = this.startPosition.y + y;

      element.style.transform = '';
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;

      this.saveElementPosition(event.source.element.nativeElement.id, element);
    }
  }

  printInvoice() {
    this.printService.startPrint();
    window.print();
    window.onafterprint = () => {
      this.printService.endPrint();
    };
  }
}
