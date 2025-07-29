import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLinkActive, RouterLink, FeatherModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private router: Router) {}
}
