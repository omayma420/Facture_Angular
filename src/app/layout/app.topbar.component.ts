// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { LayoutService } from 'src/app/layout/service/app.layout.service';
// import { AppSidebarComponent } from './app.sidebar.component';
// import { PrintService } from '../print.service';

// @Component({
//     selector: 'app-topbar',
//     templateUrl: './app.topbar.component.html'
// })
// export class AppTopbarComponent implements OnInit   {
//     isPrinting = false;
//     @ViewChild('topbarEnd') topbarEnd!: ElementRef; 

//     @ViewChild('menubutton') menuButton!: ElementRef;
//     @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
//     activeItem!: number;
//     constructor(public layoutService: LayoutService, public el: ElementRef,public printService: PrintService) {}

//     onMenuButtonClick() {
//         this.layoutService.onMenuToggle();
//     }

//     onSidebarButtonClick() {
//         this.layoutService.showSidebar();
//     }

//     onConfigButtonClick() {
//         this.layoutService.showConfigSidebar();
//     }

//     ngOnInit() {
//         // Abonnement au service d'impression pour détecter l'état d'impression
//         this.printService.printState$.subscribe(printing => {
//             this.isPrinting = printing;
//             // Gestion de l'affichage de topbarEnd en fonction de l'état d'impression
//             if (this.topbarEnd) {
//                 this.topbarEnd.nativeElement.style.display = this.isPrinting ? 'none' : 'block';
//             }
//         });
//     }
// }
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { PrintService } from '../print.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent implements OnInit {
    isPrinting = false;
    @ViewChild('topbarEnd') topbarEnd!: ElementRef; 
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    activeItem!: number;
    constructor(public layoutService: LayoutService, public el: ElementRef,public printService: PrintService) {}

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    ngOnInit() {
        this.printService.printState$.subscribe(printing => {
            this.isPrinting = printing;
            if (this.topbarEnd) {
                this.topbarEnd.nativeElement.style.display = this.isPrinting ? 'none' : 'block';
            }
        });
    }
}

    

