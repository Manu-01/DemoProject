import { Component } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { UserService } from '../../../Service/user.service';
import { AgGridAngular } from 'ag-grid-angular';
import { LinkRendererComponent } from '../../../shared/link-renderer/link-renderer.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationDetailsComponent } from '../../../shared/organization-details/organization-details.component';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-organization',
  imports: [
    FeatherModule,
    CommonModule,
    AgGridAngular,
    NgbNavModule,
    FormsModule,
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
  selected: any;
  organizaionsData: any[] = [];
  organizaionsDataLength: any;
  allContacts: any[] = [];
  filteredRole: any = null;
  roles = [
    'Customer',
    'Partner',
    'Product-Manager',
    'Manager',
    'VP',
    'Tester',
    'Developer',
  ];
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getData();
    this.onBreadCrumb();
    this.getSidebarData();
    this.stateContactData$ = history.state.data;
    if (this.stateContactData$) {
      this.sendData = this.stateContactData$;
      this.add(this.stateContactData$);
    }
  }

  getSidebarData() {
    this.userService.getSidebarData().subscribe((res: any) => {
      this.organizaionsData = res;
    });
  }

  breadCrumb = ['Organization', 'Org'];

  onBreadCrumb() {
    this.userService.mysubject$.next(this.breadCrumb);
  }

  getData() {
    this.userService.getContactData().subscribe((res: any) => {
      this.allContacts = res;
      this.rowData = [...res];
    });
  }

  fetchData(data: any) {
    this.selected = data;
    this.filteredRole = null;
    this.userService.getContactData().subscribe((res: any) => {
      this.selected = data;

      if (data === 'All') {
        this.rowData = [...this.allContacts];
        this.filteredRole = null;
        return;
      }

      this.rowData = this.allContacts.filter(
        (item: any) => item.organizationName === data
      );

      const usedRoles = this.rowData.map((d: any) => d.role);
      this.filteredRole = this.roles?.filter(
        (r: any) => !usedRoles.includes(r)
      );
    });
  }
  getContactCount(orgName: string): number {
    return this.allContacts.filter((item) => item.organizationName === orgName)
      .length;
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
    {
      headerName: 'FulName',
      valueGetter: (params: any) =>
        `${params.data?.fname}  ${params.data?.lname}`,
    },
    { field: 'role', headerName: 'Role' },
    {
      field: 'additionalroles',
      headerName: 'AdditionalRoles',
    },

    { field: 'remarks', headerName: 'Remarks' },
    { field: 'email', headerName: 'Email' },
    {
      headerName: 'Phone',
      valueGetter: (params: any) =>
        params.data?.codes + ' ' + params.data?.phone,
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

  close(event: MouseEvent, toRemove: any) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.navs = this.navs.filter((item) => item.id !== toRemove.id);
    if (this.navs.length > 0) {
      this.active = this.navs[this.navs.length - 1].id;
    } else {
      this.active = 0;
    }
  }
  add(event: any) {
    this.sendData = event;
    this.navs.push(event);
    this.active = event.id;
  }
  searchText: any;
  onSearchOrg(event: any) {
    let filteredData = this.rowData.filter((item: any) =>
      Object.values(item).join('').toLowerCase().includes(this.searchText)
    );

    if (this.searchText != '') {
      this.rowData = filteredData;
    } else {
      this.getData();
    }
  }
}
