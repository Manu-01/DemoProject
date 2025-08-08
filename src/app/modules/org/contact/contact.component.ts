import { Component, effect, signal } from '@angular/core';
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
  rowData = signal<any[]>([]);
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
  allContacts: any[] = [];
  filteredRole: any = null;
  getFilterOrganization: any;
  filteredData: any[] = [];

  contactForm = new FormGroup({
    organizationName: new FormControl('Select', Validators.required),
    role: new FormControl({ value: '', disabled: true }, Validators.required),
    remarks: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/),
      Validators.maxLength(10),
      Validators.minLength(10),
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
    additionalroles: new FormControl(''),
    addMedium: new FormArray([]),
  });
  constructor(private userService: UserService, private router: Router) {
    this.userService.setHideState(true);
    this.userService.updatePlaceholder('Search here Contacts...');
    effect(() => {
     const search = this.userService._searchData().searchQuery.toLowerCase();
      let sourceData =
        this.selected === 'All' || !this.filteredData?.length
          ? this.allContacts
          : this.filteredData;

      if (!search) {
        this.rowData.set(sourceData);
        return;
      }
      const filtered = sourceData.filter((item: any) => {
        const combinedString = Object.values(item).join(' ').toLowerCase();
        return combinedString.includes(search);
      });

      this.rowData.set(filtered);
    });
  }

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
      cellRendererParams: { key: 'organizationName' },
    },
    {
      headerName: 'Full Name',
      valueGetter: (params: any) =>
        `${params.data?.fname} ${params.data?.lname}`,
      cellRenderer: LinkRendererComponent,
      cellRendererParams: { key: 'full_name' },
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

  ngOnInit(): void {
    this.getSidebarData();
    this.onBreadCrumb();
    this.getContactData();
  }
  getCodeValue(event: any, index: number) {
    const selectedValue = event?.target?.value;
    const group = this.addMedium.at(index) as FormGroup;

    const phoneControl = group?.get('phone');
    const emailControl = group?.get('email');

    if (selectedValue === 'phone') {
      phoneControl?.setValidators([
        Validators.required,
        Validators.pattern(/^[1-9][0-9]*$/),
        Validators.maxLength(10),
        Validators.minLength(10),
      ]);
      emailControl?.clearValidators();
    } else {
      emailControl?.setValidators([Validators.required, Validators.email]);
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
  }

  get addMedium(): FormArray {
    return this.contactForm.get('addMedium') as FormArray;
  }

  addMediumfiled() {
    const group = new FormGroup({
      addMediumtype: new FormControl('email'),
      email: new FormControl('', Validators.email),
      phone: new FormControl(''),
    });

    this.addMedium.push(group);
    this.getCodeValue('email', 0);
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
      this.rowData.set([...res]);
      this.fetchData('All');
    });
  }

  fetchData(data: any) {
    this.resetForm();
    this.toggleValue = false;
    this.selected = data;

    if (data === 'All') {
      this.rowData.set([...this.allContacts]);
      this.contactForm.get('organizationName')?.enable();
      this.contactForm.get('organizationName')?.patchValue('Select');
      this.contactForm.get('role')?.disable();
      this.contactForm.get('role')?.patchValue('Select');
      return;
    }
    this.filteredData = this.allContacts.filter(
      (item: any) => item.organizationName === data
    );
    this.rowData.set(this.filteredData);
    this.contactForm.get('organizationName')?.patchValue(this.selected);
    this.getRolesByOrg();
  }

  getContactCount(orgName: string): number {
    return this.allContacts.filter((item) => item.organizationName === orgName)
      .length;
  }

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
      // this.getRolesByOrg();
    } else {
      this.contactForm.get('organizationName')?.enable();
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
    this.headerValue = 'Edit Contact';
    this.getRolesByOrg();
    this.contactForm.get('organizationName')?.disable();

    if (this.headerValue == 'Edit Contact' && this.viewData.role == 'Manager') {
      const usedRoles = this.rowData().map((d: any) => d.role);
      this.filteredRole = this.roles?.filter((role: string) => {
        if (['Product-Manager'].includes(role)) {
          return !usedRoles.includes(role);
        }
        return true;
      });
    } else if (
      this.headerValue == 'Edit Contact' &&
      this.viewData.role == 'Product-Manager'
    ) {
      const usedRoles = this.rowData().map((d: any) => d.role);
      this.filteredRole = this.roles?.filter((role: string) => {
        if (['Manager'].includes(role)) {
          return !usedRoles.includes(role);
        }
        return true;
      });
    }
  }

  onSubmit() {
    this.userService
      .CreateContactData(this.contactForm.value)
      .subscribe((res) => {
        this.getContactData();
        this.toggleValue = false;
        this.resetForm();
      });
  }

  //search Filter for Table
  // onSearchTextChanged() {
  //   const search = this.searchText2?.trim().toLowerCase();
  //   let sourceData: any[] = [];
  //   if (!search) {
  //     if (this.selected === 'All' || !this.selected) {
  //       this.rowData.set([...this.allContacts]);
  //     } else {
  //       this.rowData.set([...this.filteredData]);
  //     }
  //     return;
  //   }
  //   if (this.selected === 'All' || !this.filteredData?.length) {
  //     sourceData = this.allContacts;
  //   } else {
  //     sourceData = this.filteredData;
  //   }
  //   let rowdataSave = sourceData.filter((item: any) => {
  //     const combinedString = Object.values(item).join(' ').toLowerCase();
  //     return combinedString.includes(search);
  //   });
  //   this.rowData.set(rowdataSave);
  // }
  //search Filter for sidebar
  onSearchOrg() {
    const search = this.searchText.trim().toLowerCase();
    if (search) {
      this.organizaionsData = this.getFilterOrganization.filter((item: any) =>
        item.organizationName.toLowerCase().includes(search)
      );
    } else {
      this.getSidebarData();
    }
  }

  // setPhoneValidators() {
  //   let code = this.contactForm.get('codes')?.value;
  //   let phone = this.contactForm.get('phone');
  //   if (!phone) return;
  //   if (code === '+91' || code === '+1') {
  //     phone.setValidators([
  //       Validators.required,
  //       Validators.minLength(10),
  //       Validators.maxLength(10),
  //     ]);
  //   } else if (code === '+72') {
  //     phone.setValidators([
  //       Validators.required,
  //       Validators.minLength(7),
  //       Validators.maxLength(10),
  //     ]);
  //   }

  //   phone.updateValueAndValidity();
  // }

  updateData() {
    this.userService
      .updateContactData(this.singleId, this.contactForm.value)
      .subscribe(() => {
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
    this.resetForm();
    this.toggleValue = !this.toggleValue;
  }
  resetForm() {
    this.contactForm.reset();
    this.contactForm.patchValue({
      organizationName: 'Select',
      role: '',
      remarks: '',
      email: '',
      phone: '',
      codes: 'Select',
      fname: '',
      lname: '',
      additionalroles: '',
    });
  }

  // getRolesByOrg(event: any) {
  //   console.log(event?.target?.value);
  //   if (this.contactForm.get('organizationName')?.value) {
  //     this.contactForm.get('role')?.enable();
  //     console.log(this.contactForm);
  //   }
  // }

  getRolesByOrg() {
    const role = this.contactForm.get('role');
    if (this.contactForm.get('organizationName')?.value) {
      role?.enable();
      const usedRoles = this.rowData().map((d: any) => d.role);
      this.filteredRole = this.roles?.filter((role: string) => {
        if (['Manager', 'Product-Manager'].includes(role)) {
          return !usedRoles.includes(role);
        }
        return true;
      });
    }
  }
}
