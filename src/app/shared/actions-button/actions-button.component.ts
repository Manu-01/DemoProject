import { Component } from '@angular/core';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-actions-button',
  imports: [FeatherModule],
  templateUrl: './actions-button.component.html',
  styleUrl: './actions-button.component.scss',
})
export class ActionsRenderComponent {
  params: any;

  agInit(params: any) {
    this.params = params;
  }
  edit(): void {
    this.params.context.componentParent.edit(this.params.data.id);
  }

  onDelete(): void {
    this.params.context.componentParent.onDelete(this.params.data.id);
  }
}
