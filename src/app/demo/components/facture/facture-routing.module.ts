import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {  FactureComponent} from "./facture.component";



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {path : 'consult-facture' , component : FactureComponent ,}
    ])
  ],
})
export class FactureRoutingModule { }
