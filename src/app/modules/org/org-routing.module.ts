import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { SolutionAreaComponent } from './solution-area/solution-area.component';
import { OrganizationComponent } from './organization/organization.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'organization',
    pathMatch: 'full',
  }, { path: 'organization', component: OrganizationComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'solution-area', component: SolutionAreaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgRoutingModule { }
