import { Component } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { NgClass } from '@angular/common';
import { ActionsRenderComponent } from '../../../shared/actions-button/actions-button.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../Service/user.service';
@Component({
  selector: 'app-mytask',
  imports: [
    FeatherModule,
    ReactiveFormsModule,
    NgClass,
    AgGridAngular,
    HttpClientModule,
  ],
  templateUrl: './mytask.component.html',
  styleUrl: './mytask.component.scss',
})
export class MytaskComponent {
  myForm!: FormGroup;
  toggleValue: boolean = false;
  rowData: any;
  mode: boolean = false;
  status = ['Active', 'InActive'];
  priority = ['Low', 'Medium', 'High'];

  constructor(private userService: UserService) {
    this.myForm = new FormGroup({
      solutionArea: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/),
      ]),
      workFlow: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/),
      ]),
      taskId: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      taskName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/),
      ]),
      startDate: new FormControl('', Validators.required),
      dueDate: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.getData();
    this.SetBreadCrumb();
  }

  saveData() {
    if (this.myForm.valid) {
      this.userService.createUser(this.myForm.value).subscribe((res: any) => {
        this.getData();
        this.toggleValue = false;
        this.myForm.reset();
      });
    } else {
      console.log('error');
    }
  }

  clearAll() {
    this.myForm.reset();
  }
  toggleShowHide() {
    this.toggleValue = !this.toggleValue;
  }

  getData() {
    this.userService.getData().subscribe((res: any) => {
      this.rowData = res;
    });
  }

  colDefs = [
    {
      filed: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: 'id', headerName: 'Id' },
    { field: 'solutionArea', headerName: 'SolutionArea' },
    { field: 'workFlow', headerName: 'WorkFlow' },
    { field: 'taskId', headerName: 'TaskId' },
    {
      field: 'status',
      headerName: 'Status',
      cellStyle: (params: any) => {
        if (params.value === 'Active') {
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }
      },
    },
    { field: 'taskName', headerName: 'TaskName' },
    { field: 'startDate', headerName: 'StartDate' },
    { field: 'dueDate', headerName: 'DueDate' },
    {
      field: 'priority',
      headerName: 'Priority',
      cellStyle: (params: any) => {
        if (params.value === 'Low') {
          return { color: 'red' };
        } else if (params.value === 'Medium') {
          return { color: 'orange' };
        } else {
          return { color: 'green' };
        }
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1.5,
      cellRenderer: ActionsRenderComponent,
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
  array = ['My Menu', 'My Task'];
  SetBreadCrumb() {
    this.userService.mysubject$.next(this.array);
  }

  singleData: any;
  edit(id: any) {
    this.userService.getById(id).subscribe((data) => {
      this.singleData = data.id;
      this.toggleValue = true;
      this.myForm.patchValue(data);
      this.getData();
      this.mode = true;
    });
  }

  onDelete(id: any) {
    let userConfirmed = confirm('Are you sure you want to delete this user?');
    if (userConfirmed) {
      this.userService.deletById(id).subscribe(() => {
        this.getData();
      });
    } else {
    }
  }

  onUpdate() {
    this.mode = false;
    if (this.myForm.valid) {
      this.userService
        .updateData(this.singleData, this.myForm.value)
        .subscribe(() => {
          this.toggleValue = false;
          this.getData();
        });
      this.myForm.reset();
    } else {
      console.log('Invalid Credentials');
      this.myForm.markAllAsTouched();
    }
  }

  validateDueDate(event: any) {
    let today = new Date().toISOString().split('T')[0];
    event.target.min = today;
  }
}
