import { Component, Input, OnInit } from '@angular/core';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-organization-details',
  imports: [NgbNavModule, NgbAlertModule],
  templateUrl: './organization-details.component.html',
  styleUrl: './organization-details.component.scss',
})
export class OrganizationDetailsComponent implements OnInit {
  active = 1;
  @Input() mydata: any;
  Explaindata: any[] = [];
  ngOnInit(): void {
    this.Explaindata.push(this.mydata);

    console.log(this.Explaindata);
  }
}
