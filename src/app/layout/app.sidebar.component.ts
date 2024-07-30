import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { PrintService } from '../print.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent implements OnInit {
    timeout: any = null;
    isPrinting = false; // Ajout de la variable pour gérer l'état d'impression
    @ViewChild('menuContainer') menuContainer!: ElementRef;

    constructor(public layoutService: LayoutService, public printService: PrintService) {} // Ajout de printService dans le constructeur

    ngOnInit() {
        // Abonnement au service d'impression pour détecter l'état d'impression
        this.printService.printState$.subscribe(printing => {
            this.isPrinting = printing;
            // Gestion de l'affichage du menuContainer en fonction de l'état d'impression
            if (this.menuContainer) {
                if (this.isPrinting) {
                    this.menuContainer.nativeElement.style.display = 'none';
                } else {
                    this.menuContainer.nativeElement.style.display = 'block';
                }
            }
        });
    }

    onMouseEnter() {
        if (!this.layoutService.state.anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.layoutService.state.sidebarActive = true;
        }
    }

    onMouseLeave() {
        if (!this.layoutService.state.anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => (this.layoutService.state.sidebarActive = false), 300);
            }
        }
    }

    anchor() {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
    }
}
