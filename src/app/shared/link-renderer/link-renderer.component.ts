import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-link-renderer',
  imports: [],
  templateUrl: './link-renderer.component.html',
  styleUrl: './link-renderer.component.scss',
})
export class LinkRendererComponent implements ICellRendererAngularComp {
  param: any;

  agInit(params: any): void {
    this.param = params;
  }

  refresh(params: ICellRendererParams<any, any, any>): any {}

  viewDetails() {
    if (this.param.key === 'organizationName')
      this.param.context.componentParent.add(this.param.data);
  }
}
