// search-store.ts
import { signal } from '@angular/core';
export const searchQuery = signal<string>('');
export const placeholderSignal = signal<string>('Search here...');
export const searchHide = signal<Boolean>(true);
