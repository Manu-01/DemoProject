import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { OrganizationDetailsComponent } from '../../../shared/organization-details/organization-details.component';
import { UserService } from '../../../Service/user.service';
import { LinkRendererComponent } from '../../../shared/link-renderer/link-renderer.component';
import { FeatherModule } from 'angular-feather';
import { JsonPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
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
  OrganizaionsData: any[] = [];
  OrganizaionsDataLength: any;
  toggleValue: boolean = false;
  viewCard: boolean = false;
  copyRowData: any[] = [];

  // constructor() {}
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
    organizationName: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    industry: new FormControl('', Validators.required),
    onboarding: new FormControl('', Validators.required),
    product: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    codes: new FormControl(''),
  });
  ngOnInit(): void {
    this.getData();
    this.fetchData('All');
    this.onBreadCrumb();
  }
  getData() {
    this.userService.getContactData().subscribe((res: any) => {
      this.OrganizaionsData = res;
      this.OrganizaionsDataLength = this.OrganizaionsData.map(
        (item: any) => item.contacts
      );
    });
  }
  filteredRole: any;
  fetchData(data: any) {
    this.userService.getContactData().subscribe((res: any) => {
      this.rowData = res.map((item: any) => item.contacts).flat();
      if (data == 'All') {
        this.selected = data;
        return this.rowData;
      } else {
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
    { field: 'role', headerName: 'Role', cellRenderer: LinkRendererComponent },
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
    this.active = event.id;
    this.navs.push(event);
    this.router.navigate(['/org/organization'], {
      state: { data: event.data },
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
  viewData: any;
  rowDataSelect(event: any) {
    this.toggleValue = true;
    this.viewCard = true;
    this.viewData = event.data;
  }

  patchData() {
    this.viewCard = false;
    this.contactForm.patchValue(this.viewData);
  }

  onSubmit(event: any) {
    console.log('onsubmit called');
    this.userService
      .UpdateData(this.viewData.id, this.contactForm.value)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
