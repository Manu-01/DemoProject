import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Service/user.service';

@Component({
  selector: 'app-teamtask',
  imports: [],
  templateUrl: './teamtask.component.html',
  styleUrl: './teamtask.component.scss',
})
export class TeamtaskComponent implements OnInit {
  constructor(private userService: UserService) {
    this.userService.setHideState(false);
  }

  ngOnInit(): void {
    this.SetBreadCrumb();
  }

  array = ['My Menu', 'Team Task'];
  SetBreadCrumb() {
    this.userService.mysubject$.next(this.array);
  }
}
