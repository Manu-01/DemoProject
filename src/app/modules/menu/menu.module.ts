import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { MytaskComponent } from './mytask/mytask.component';

ModuleRegistry.registerModules([AllCommunityModule]);
@NgModule({
  declarations: [],
  imports: [CommonModule, MenuRoutingModule, AgGridModule, MytaskComponent],
})
export class MenuModule {}
