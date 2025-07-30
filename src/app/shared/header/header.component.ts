import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import { UserService } from '../../Service/user.service';
import { ENVIORNMENT } from '../../../../env';

@Component({
  selector: 'app-header',
  imports: [FeatherModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  breadCrumbData: any;

  constructor(private router: Router, private service: UserService) {
    this.isProduction = ENVIORNMENT.production;
  }
  isProduction!: boolean;

  ngOnInit() {
    this.service.mysubject$.subscribe((breadCrumb) => {
      this.breadCrumbData = breadCrumb;
    });
  }

  redirectToLiveSite(): void {
    window.location.href = 'https://www.manuspike.netlify.app/'; // Replace with your actual live website URL
  }
}
