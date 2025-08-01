import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';

import { UserService } from '../../../Service/user.service';
import { LinkRendererComponent } from '../../../shared/link-renderer/link-renderer.component';
import { FeatherModule } from 'angular-feather';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import {
  FormArray,
  FormBuilder,
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
    CommonModule,
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
  mode: boolean = false;
  viewData: any;
  singleId: any;
  searchText: any;
  searchText2: any;
  gridApi: any;
  headerValue = 'Add Contacts';
  deleteId: any = null;
  getFilterOrganization: any;
  filteredData: any[] = [];
  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

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
  ngOnInit(): void {
    this.getSidebarData();
    this.fetchData('All');
    this.onBreadCrumb();
    this.getContactData();
    this.contactForm.get('codes')?.valueChanges.subscribe(() => {
      this.setPhoneValidators();
    });
    this.getCodeValue('email', 0);

    this.contactForm.get('fname')?.valueChanges.subscribe((dt) => {
      console.log('test', this.contactForm.value);
    });
  }
  getCodeValue(event: any, index: number) {
    const selectedValue = event.target?.value;
    const mediumGroup = this.contactForm.get('addMedium') as FormArray;
    const emailControl = mediumGroup?.get('email');
    const phoneControl = mediumGroup?.get('phone');

    if (selectedValue === 'email') {
      emailControl?.setValidators([Validators.required, Validators.email]);
      phoneControl?.clearValidators();
      phoneControl?.setValue('');
    } else if (selectedValue === 'phone') {
      phoneControl?.setValidators([
        Validators.required,
        Validators.pattern(/^[1-9][0-9]*$/),
        Validators.maxLength(10),
      ]);
      emailControl?.clearValidators();
      emailControl?.setValue('');
    }

    emailControl?.updateValueAndValidity();
    phoneControl?.updateValueAndValidity();
  }

  contactForm = new FormGroup({
    organizationName: new FormControl('Select', Validators.required),
    role: new FormControl('', Validators.required),
    remarks: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/),
      Validators.maxLength(10),
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
    addMedium: new FormArray([]),
  });

  get addMedium(): FormArray {
    return this.contactForm.get('addMedium') as FormArray;
  }

  addMediumfiled() {
    this.addMedium.push(
      new FormGroup({
        addMediumtype: new FormControl('email'),
        email: new FormControl('heello gurmmeet'),
        phone: new FormControl('', [Validators.required]),
      })
    );
  }
  removeAddMedium(index: number) {
    this.addMedium.removeAt(index);
  }

  getSidebarData() {
    this.userService.getSidebarData().subscribe((res: any) => {
      this.organizaionsData = res;
      this.getFilterOrganization = res;
    });
  }

  getContactData() {
    this.userService.getContactData().subscribe((res: any) => {
      this.allContacts = res;
      this.rowData = [...res];
    });
  }
  allContacts: any[] = [];
  filteredRole: any = null;

  fetchData(data: any) {
    this.selected = data;
    // this.filteredRole = null;
    this.userService.getContactData().subscribe((res: any) => {
      this.selected = data;
      if (data === 'All') {
        this.rowData = [...this.allContacts];
        this.filteredRole = null;
        return;
      }
      this.filteredData = this.allContacts.filter(
        (item: any) => item.organizationName === data
      );
      this.rowData = this.filteredData;

      const usedRoles = this.rowData.map((d: any) => d.role);

      this.filteredRole = this.roles?.filter((role: string) => {
        if (['Manager', 'Product-Manager'].includes(role)) {
          return !usedRoles.includes(role);
        }
        return true;
      });

      // Optional: Reset form role value if current one is not allowed
      // const currentRole = this.contactForm.get('role')?.value;
      // if (!this.filteredRole.includes(currentRole)) {
      //   this.contactForm.get('role')?.patchValue(null);
      // }
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
      flex: 1,
    },
    {
      field: 'organizationName',
      headerName: 'OrganizationName',
      cellRenderer: LinkRendererComponent,
    },
    {
      headerName: 'Full Name',
      valueGetter: (params: any) =>
        `${params.data?.fname} ${params.data?.lname}`,
      cellRenderer: (params: any) => {
        const fullName = `${params.data?.fname} ${params.data?.lname}`;
        return `<a href="javascript:void(0)" style="color: blue; text-decoration: underline;">${fullName}</a>`;
      },
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
      flex: 2,
    },
    context: {
      componentParent: this,
    },
    onGridReady: (params: any) => {
      this.gridApi = params.api;
    },
    onSelectionChanged: () => {
      const selectedRows = this.gridApi.getSelectedRows();
      console.log(selectedRows);
      if (selectedRows.length > 0) {
        this.deleteId = selectedRows[0].id;
      } else {
        this.deleteId = null;
      }
    },
  };

  add(event: any) {
    this.sendData = event;
    this.router.navigate(['/org/organization'], {
      state: { data: event }, //state data send to organization Page
    });
  }

  breadCrumb = ['Organization', 'Contact'];
  onBreadCrumb() {
    this.userService.mysubject$.next(this.breadCrumb);
  }

  toggleShowHide() {
    this.viewCard = false;
    if (!this.toggleValue) {
      this.toggleValue = true;
    }
    this.headerValue = 'Add Contact';
    this.mode = false;
    this.resetForm();
    if (this.selected !== 'All') {
      this.contactForm.get('organizationName')?.patchValue(this.selected);
      this.contactForm.get('organizationName')?.disable();
    }
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
    this.contactForm.patchValue(this.viewData); // Patch normally
    this.viewCard = false;
    this.mode = true;
    this.headerValue = ' Edit Contact';
    const role = this.viewData.role;
  }

  onSubmit() {
    this.userService
      .CreateContactData(this.contactForm.value)
      .subscribe((res) => {
        this.getContactData();
        this.toggleValue = false;
      });
  }
  //search Filter for Table

  onSearchTextChanged() {
    const search = this.searchText2?.trim().toLowerCase();

    let sourceData: any[] = [];

    if (!search) {
      if (this.selected === 'All' || !this.selected) {
        this.rowData = [...this.allContacts];
      } else {
        this.rowData = [...this.filteredData];
      }
      return;
    }
    if (this.selected === 'All' || !this.filteredData?.length) {
      sourceData = this.allContacts;
    } else {
      sourceData = this.filteredData;
    }
    this.rowData = sourceData.filter((item: any) => {
      const combinedString = Object.values(item).join(' ').toLowerCase();
      return combinedString.includes(search);
    });
  }
  //search Filter for sidebar
  onSearchOrg(event: any) {
    const search = this.searchText.trim().toLowerCase();
    if (search) {
      this.organizaionsData = this.getFilterOrganization.filter((item: any) =>
        item.organizationName.toLowerCase().includes(search)
      );
    } else {
      this.getSidebarData();
    }
  }

  setPhoneValidators() {
    let code = this.contactForm.get('codes')?.value;
    let phone = this.contactForm.get('phone');

    if (!phone) return;

    if (code === '+91' || code === '+1') {
      phone.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    } else if (code === '+72') {
      phone.setValidators([
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
      ]);
    }

    phone.updateValueAndValidity();
  }

  updateData() {
    this.userService
      .updateContactData(this.singleId, this.contactForm.value)
      .subscribe((res) => {
        this.getContactData();
        this.toggleValue = false;
        this.resetForm();
      });
  }

  deleteData() {
    let confirmed = confirm('are you sure you want to delete ?');
    if (confirmed) {
      this.userService.deleteContactData(this.deleteId).subscribe((res) => {
        this.getContactData();
      });
    }
  }

  cancel() {
    this.toggleValue = !this.toggleValue;
    this.resetForm();
  }
  resetForm() {
    this.contactForm.reset({
      fname: '',
      lname: '',
      email: '',
      phone: '',
      remarks: '',
      additionalroles: '',
      organizationName: 'Select',
      codes: 'Select',
      role: 'Select',
    });
  }

  test() {
    console.log(this.contactForm.value);
  }
}
