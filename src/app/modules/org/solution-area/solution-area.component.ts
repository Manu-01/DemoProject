import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Service/user.service';

@Component({
  selector: 'app-solution-area',
  imports: [],
  templateUrl: './solution-area.component.html',
  styleUrl: './solution-area.component.scss',
})
export class SolutionAreaComponent implements OnInit {
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.onBreadCrumb();
  }

  breadCrumb = ['Organization', 'Solution Area'];

  onBreadCrumb() {
    this.userService.mysubject$.next(this.breadCrumb);
  }
}
