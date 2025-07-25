import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MytaskComponent } from './mytask/mytask.component';
import { TeamtaskComponent } from './teamtask/teamtask.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'mytask', pathMatch: 'full'
  },
  {
    path: 'mytask',
    component: MytaskComponent
  },
  {
    path: 'teamtask',
    component: TeamtaskComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
