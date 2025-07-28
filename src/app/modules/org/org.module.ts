import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrgRoutingModule } from './org-routing.module';
import { AgGridModule } from 'ag-grid-angular';
 import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
    
    ModuleRegistry.registerModules([ AllCommunityModule ]);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrgRoutingModule,
    AgGridModule
  ]
})
export class OrgModule { }
