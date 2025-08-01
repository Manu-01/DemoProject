import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import { UserService } from '../../Service/user.service';
import { ENVIORNMENT } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [FeatherModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  breadCrumbData: any;
  isProduction!: boolean;
  constructor(private router: Router, private service: UserService) {
    this.isProduction = ENVIORNMENT.production;
  }

  ngOnInit() {
    this.service.mysubject$.subscribe((breadCrumb) => {
      this.breadCrumbData = breadCrumb;
    });
  }

  redirectToLiveSite(): void {
    console.log(this.isProduction);
    window.location.href = 'http://manuspike.netlify.app/'; // Replace with your actual live website URL
  }
}
