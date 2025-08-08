import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { CommonModule } from '@angular/common';
import { UserService } from './../../Service/user.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, FeatherModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  constructor(private userService: UserService) {}

  query = computed(() => this.userService._searchData().searchQuery);
  placeholder = computed(() => this.userService._searchData().placeholder);
  hide = computed(() => this.userService._searchData().hide);

  onInputChange(value: string) {
    this.userService.updateSearchQuery(value.trim().toLowerCase());
  }

  clearSearch() {
    this.userService.updateSearchQuery('');
  }

  toggleInputSearch() {
    this.userService.setHideState(!this.hide());
  }
}
