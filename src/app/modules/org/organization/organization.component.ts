import { Component, Input } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { UserService } from '../../../Service/user.service';
import { AgGridAngular } from 'ag-grid-angular';
import { LinkRendererComponent } from '../../../shared/link-renderer/link-renderer.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationDetailsComponent } from '../../../shared/organization-details/organization-details.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-organization',
  imports: [
    FeatherModule,
    AgGridAngular,
    NgbNavModule,
    OrganizationDetailsComponent,
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss',
})
export class OrganizationComponent {
  rowData: any;
  navs: any[] = [];
  active: any;
  tabName: any;
  counter = this.navs.length + 1;
  sendData: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getData('All');
  }
  getData(data: any) {
    this.userService.getOrgData().subscribe((res: any) => {
      if (data == 'All') {
        this.rowData = res;
      } else {
        this.rowData = res.filter((item: any) => item.type == data);
      }
    });
  }

  colDefs = [
    {
      filed: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      field: 'organizationName',
      headerName: 'OrganizationName',
      cellRenderer: LinkRendererComponent,
    },
    { field: 'type', headerName: 'Type' },
    { field: 'industry', headerName: 'Industry' },

    { field: 'onboarding', headerName: 'Onboarding' },
    { field: 'product', headerName: 'Product' },
    { field: 'email', headerName: 'Email' },
    {
      field: 'phone',
      headerName: 'Phone',
    },
  ];

  gridOptions = {
    defaultColDef: {
      sortable: false,
      flex: 1,
    },
    context: {
      componentParent: this,
    },
  };

  close(event: MouseEvent, toRemove: number) {
    this.navs = this.navs.filter((id) => id !== toRemove);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  add(event: any) {
    this.sendData = event;
    this.navs.push(event);
    this.active = event.id;
  }
}
