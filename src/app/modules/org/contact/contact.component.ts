import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { OrganizationDetailsComponent } from '../../../shared/organization-details/organization-details.component';
import { UserService } from '../../../Service/user.service';
import { LinkRendererComponent } from '../../../shared/link-renderer/link-renderer.component';
import { FeatherModule } from 'angular-feather';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contact',
  imports: [
    FeatherModule,
    AgGridAngular,
    NgbNavModule,

    // OrganizationDetailsComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  rowData: any;
  navs: any[] = [];
  active: any;
  tabName: any;
  counter = this.navs.length + 1;
  sendData: any[] = [];
  OrganizaionsData: any[] = [];

  // constructor() {}
  constructor(private router: Router,private userService: UserService) {}

  ngOnInit(): void {
    this.getData();
    this.fetchData('All');
  }
  getData() {
    this.userService.getContactData().subscribe((res: any) => {
      this.OrganizaionsData = res;
    });
  }

  fetchData(data: any) {
    this.userService.getContactData().subscribe((res: any) => {
      this.rowData = res.map((item: any) => item.contacts).flat();
      if (data == 'All') {
        return this.rowData;
      } else {
        this.rowData = this.rowData.filter(
          (item: any) => item.organizationName === data
        );
        return this.rowData;
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
    { field: 'type', headerName: 'Type' , cellRenderer: LinkRendererComponent, },
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
    // event.preventDefault();
    event.stopImmediatePropagation();
  }

  add(event: any) {
    this.sendData = event;
     console.log(event.id)
    this.active = event.id;
    this.navs.push(event);
      this.router.navigate(['/org/organization']);
   
  }
}
