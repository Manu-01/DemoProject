import { Component } from '@angular/core';
import { FeatherModule } from 'angular-feather';
 

import { Camera, Heart, Github } from 'angular-feather/icons';

@Component({
  selector: 'app-header',
  imports: [FeatherModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
