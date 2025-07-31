import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { OrganizationDetailsComponent } from '../../../shared/organization-details/organization-details.component';
import { UserService } from '../../../Service/user.service';
import { LinkRendererComponent } from '../../../shared/link-renderer/link-renderer.component';
import { FeatherModule } from 'angular-feather';
import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ENVIORNMENT } from '../../../../../env';
// import { env } from 'process';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-contact',
  imports: [
    FeatherModule,
    AgGridAngular,
    NgbNavModule,
    NgClass,
    NgbDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    // OrganizationDetailsComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  rowData: any;
  selected: any;
  navs: any[] = [];
  active: any;
  tabName: any;
  counter = this.navs.length + 1;
  sendData: any[] = [];
  organizaionsData: any[] = [];
  organizaionsDataLength: any;
  toggleValue: boolean = false;
  viewCard: boolean = false;
  copyRowData: any[] = [];
  checkRolles: any;
  mode: boolean = false;
  viewData: any;
  singleId: any;
  searchText: any;
  gridApi: any;
  deleteId: any;
  constructor(private router: Router, private userService: UserService) {}
  orgnizations = ['In2IT', 'In2IT A', 'NextGen IT', 'CloudAxis'];
  onboarding = ['Active', 'Inactive', 'Pending'];
  codes = ['+91', '+1', '+72'];
  roles = [
    'Customer',
    'Partner',
    'Product-Manager',
    'Manager',
    'VP',
    'Tester',
    'Developer',
  ];
  contactForm = new FormGroup({
    organizationName: new FormControl('Select', Validators.required),
    role: new FormControl(null, Validators.required),
    remarks: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/),
    ]),
    codes: new FormControl('', Validators.required),
    fname: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.pattern(/^[a-zA-Z\s]+$/),
    ]),
    lname: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.pattern(/^[a-zA-Z\s]+$/),
    ]),
    additionalroles: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z\s]+$/),
    ]),
  });
  ngOnInit(): void {
    this.getSidebarData();
    this.fetchData('All');
    this.onBreadCrumb();
    this.onChangePlaceHolder();
    this.getContactdata();
  }
  getSidebarData() {
    this.userService.getSidebarData().subscribe((res: any) => {
      this.organizaionsData = res;
    });
  }
  getContactdata() {
    this.userService.getContactData().subscribe((res: any) => {
      this.allContacts = res;
      this.rowData = [...res];
    });
  }
  allContacts: any[] = [];
  filteredRole: any = null;
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

      let isManagerUsed = usedRoles.includes('Manager');
      if (isManagerUsed) {
        this.filteredRole = this.roles.filter((item) => item != 'Manager');
      }
      // this.filteredRole = this.roles?.filter(
      //   (r: any) => !usedRoles.includes(r)
      // );
      // this.contactForm.get('role')?.patchValue(this.filteredRole);
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

      cellRenderer: LinkRendererComponent,
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
    onGridReady: (params: any) => {
      this.gridApi = params.api;
    },
    onSelectionChanged: () => {
      const selectedRows = this.gridApi.getSelectedRows();
      this.deleteId = selectedRows[0].id;
    },
  };

  add(event: any) {
    this.sendData = event;
    this.router.navigate(['/org/organization'], {
      state: { data: event },
    });
  }
  breadCrumb = ['Organization', 'Contact'];

  onBreadCrumb() {
    this.userService.mysubject$.next(this.breadCrumb);
  }

  toggleShowHide() {
    this.viewCard = false;
    this.toggleValue = !this.toggleValue;
    this.contactForm.get('organizationName')?.patchValue(this.selected);
  }
  toggleViewcard() {
    this.toggleValue = true;
    this.viewCard = !this.viewCard;
  }

  rowDataSelect(event: any) {
    this.singleId = event.data.id;

    this.toggleValue = true;
    this.viewCard = true;
    this.viewData = event.data;
  }

  patchData() {
    this.viewCard = false;
    this.mode = true;
    this.contactForm.patchValue(this.viewData);
  }

  onSubmit() {
    this.userService
      .CreateContactData(this.contactForm.value)
      .subscribe((res) => {
        this.getContactdata();
        this.toggleValue = false;
      });
  }

  onSearchTextChanged(event: any) {
    let filteredData = this.rowData.filter((item: any) =>
      Object.values(item).join('').toLowerCase().includes(event.toLowerCase())
    );
    if (this.searchText != '') {
      this.rowData = filteredData;
    } else {
      this.fetchData('All');
    }
  }

  onSearchOrg(event: any) {
    let filteredData = this.organizaionsData.filter((item: any) =>
      item.organizationName.toLowerCase().includes(event.toLowerCase())
    );
    if (this.searchText != '') {
      this.organizaionsData = filteredData;
    } else {
      this.getSidebarData();
    }
  }

  onChangePlaceHolder() {
    let code = this.contactForm.get('codes')?.value;
    let phone = this.contactForm.get('phone');

    if (code == '+91') {
      return phone?.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    } else if (code == '+1') {
      phone?.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
      return '10 only';
    } else if (code == '+72') {
      return phone?.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(7),
      ]);
    }
  }

  updateData() {
    this.userService
      .updateContactData(this.singleId, this.contactForm.value)
      .subscribe((res) => {
        this.getContactdata();
        this.toggleValue = false;
        this.contactForm.reset();
      });
  }
  deleteData() {
    let confirmed = confirm('are you sure you want to delete ?');
    if (confirmed) {
      this.userService.deleteContactData(this.deleteId).subscribe((res) => {
        this.getContactdata();
      });
    }
  }

  cancel() {
    this.toggleValue = !this.toggleValue;
    this.contactForm.reset();
  }
  resetForm() {
    this.contactForm.reset();
    this.contactForm.get('codes');
  }
}
