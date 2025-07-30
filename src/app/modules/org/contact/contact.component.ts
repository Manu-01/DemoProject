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
    NgIf
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

  constructor(private router: Router, private userService: UserService) { }
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
    organizationName: new FormControl('', Validators.required),
    role: new FormControl(null, Validators.required),
    remarks: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    codes: new FormControl('', Validators.required),
    fname: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z]+$/)]),
    lname: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z]+$/)]),
    additionalroles: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
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
      console.log(this.organizaionsData);
    });
  }
  getContactdata() {
    this.userService.getContactData().subscribe((res: any) => {
      this.rowData = res;
      console.log(this.rowData);
    });
  }

  filteredRole: any = null;
  fetchData(data: any) {
    this.selected = data;
    // this.contactForm.get('organizationName')?.patchValue(this.selected);
    this.filteredRole = null;
    this.userService.getContactData().subscribe((res: any) => {
      if (data == 'All') {
        this.selected = data;
        console.log(data);
        return this.rowData;
      } else {
        console.log(data);
        this.selected = data;
        this.rowData = this.rowData.filter(
          (item: any) => item.organizationName === data
        );
        const usedRoles = this.rowData.map((data: any) => {
          return data.role;
        });
        this.filteredRole = this.roles.filter(
          (items: any) => !usedRoles.includes(items)
        );
        console.log(this.filteredRole);
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
    // this.contactForm.get('organizationName')?.patchValue(this.selected);
  }
  toggleViewcard() {
    this.toggleValue = true;
    this.viewCard = !this.viewCard;
  }

  rowDataSelect(event: any) {
    this.singleId = event.id;
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
    if (code == '+91') {
      return 'Enter 10  digit number';
    } else if (code == '+1') {
      return 'Enter 10 digit number';
    } else if (code == '+72') {
      return 'Enter 7 digit number';
    } else {
      return 'Enter phone number';
    }
  }

  Updatedata() {
    this.userService
      .updateContactData(this.singleId, this.contactForm.value)
      .subscribe((res) => {
        console.log(res);
      });
  }
  Cancel() {
    this.toggleValue = !this.toggleValue;
    this.contactForm.reset();
  }
  resetForm() {
    this.contactForm.reset();
  }

  showForm() {
    console.log(this.contactForm.get('organizationName')?.value);
  }
}
