import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {

    @ViewChild('menubutton') menuButton!: ElementRef;

    activeItem!: number;

    constructor(public layoutService: LayoutService) { }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }
    

}