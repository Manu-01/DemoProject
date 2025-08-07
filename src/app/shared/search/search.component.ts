import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { searchQuery, placeholderSignal, searchHide } from '../search-store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, FeatherModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  query = searchQuery;
  searchide = searchHide;
  placeholderSignal = placeholderSignal;
  inputSearchValue: boolean = false;
  constructor() {}
  onInputChange(value: string) {
    this.query.set(value.trim().toLowerCase());
  }

  clearSearch() {
    this.query.set('');
  }
  toggleInputSeach() {
    this.inputSearchValue = !this.inputSearchValue;
  }
}
