import { Component, Input, OnInit } from '@angular/core';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { FeatherModule } from 'angular-feather';
import { UserService } from '../../Service/user.service';

@Component({
  selector: 'app-organization-details',
  imports: [NgbNavModule, NgbAlertModule, AgGridAngular, FeatherModule],
  templateUrl: './organization-details.component.html',
  styleUrl: './organization-details.component.scss',
})
export class OrganizationDetailsComponent implements OnInit {
  constructor(private service: UserService) {}
  active = 1;
  @Input() mydata: any;
  Explaindata: any[] = [];
  organizationName: any;
  rowData: any[] = [];
  ngOnInit(): void {
    this.Explaindata.push(this.mydata);

    this.getAllData();
    this.organizationName = this.mydata.organizationName;
  }
  // get contacts for the rowdata

  getAllData() {
    this.service.getContactData().subscribe((res: any) => {
      let data = res.filter(
        (item: any) => item.organizationName == this.organizationName
      );
      this.rowData = data;
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
    },
    {
      headerName: 'FulName',
      valueGetter: (params: any) =>
        `${params.data?.fname}  ${params.data?.lname}`,

      // cellRenderer: LinkRendererComponent,
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
}
