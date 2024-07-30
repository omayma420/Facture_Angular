import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import {FactureRoutingModule} from './facture-routing.module'
import {  FactureComponent} from "./facture.component";
import {CdkDrag} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { CdkDragStart, CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';




@NgModule({
  declarations: [FactureComponent],
  imports: [
    FactureRoutingModule,
    CommonModule,
    ButtonModule,
    RippleModule,
    TagModule,
    TooltipModule,
    TableModule,
    InputNumberModule,
    ChartModule,
    DropdownModule,
    FormsModule,
    TabViewModule,
    ConfirmDialogModule,
    CarouselModule,
    DialogModule,
    MenuModule,
    OverlayPanelModule,
    MessagesModule,
    AutoCompleteModule,
    InputTextModule,
    InputMaskModule,
    ToastModule,
    DialogModule,
    FormsModule,
    DragDropModule,
    CdkDrag,
    DragDropModule

  ]
})
export class FactureModule { }



