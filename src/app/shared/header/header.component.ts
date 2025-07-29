import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import { UserService } from '../../Service/user.service';

@Component({
  selector: 'app-header',
  imports: [FeatherModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  breadCrumbData: any;

  constructor(private router: Router, private service: UserService) {}

  ngOnInit() {
    this.service.mysubject$.subscribe((breadCrumb) => {
      this.breadCrumbData = breadCrumb;
    });
  }
}
