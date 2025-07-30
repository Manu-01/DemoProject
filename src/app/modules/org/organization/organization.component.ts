import { Component, Input } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { UserService } from '../../../Service/user.service';
import { AgGridAngular } from 'ag-grid-angular';
import { LinkRendererComponent } from '../../../shared/link-renderer/link-renderer.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationDetailsComponent } from '../../../shared/organization-details/organization-details.component';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization',
  imports: [
    FeatherModule,
    CommonModule,
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
  stateContactData$: any;
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getData('All');
    this.onBreadCrumb();
    this.stateContactData$ = history.state.data;

    if (this.stateContactData$) {
      this.sendData = this.stateContactData$;
      this.add(this.stateContactData$);
    }
  }

  breadCrumb = ['Organization', 'Org'];

  onBreadCrumb() {
    this.userService.mysubject$.next(this.breadCrumb);
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

  // close(event: MouseEvent, toRemove: number) {
  //   this.navs = this.navs.filter((id) => id !== toRemove);
  //   event.preventDefault();
  //   event.stopImmediatePropagation();
  // }
  trackById(index: number, item: any) {
    return item.id;
  }

  close(event: MouseEvent, toRemove: any) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.navs = this.navs.filter((item) => item.id !== toRemove.id);
    if (this.navs.length > 0) {
      this.active = this.navs[this.navs.length - 1].id;
    } else {
      this.active = 0;
    }
    console.log(this.active);
  }
  add(event: any) {
    this.sendData = event;
    this.navs.push(event);
    this.active = event.id;
  }
}
