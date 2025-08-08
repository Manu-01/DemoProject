import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface config {
  show: boolean;
  placeholder?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:3000/task';
  private sidebarJsonUrl = 'http://localhost:3000/sidebarJson';
  private contactsData = 'http://localhost:3000/ContactData';

  _searchData = signal<config>({
    placeholder: 'Search here',
    show: true,
  });

  searchText = signal<string | null>('');

  mysubject$ = new Subject<any>();

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.url}`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.url}`, data);
  }
  getById(id: any): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
  updateData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, data);
  }
  deletById(id: any): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // OrganizationsData
  getOrgData(): Observable<any> {
    return this.http.get(`${this.contactsData}`);
  }

  //SidebarJsonData
  getSidebarData(): Observable<any> {
    return this.http.get(`${this.sidebarJsonUrl}`);
  }

  //CreateData
  CreateContactData(data: any): Observable<any> {
    return this.http.post(`${this.contactsData}`, data);
  }
  //getAllConatctData
  getContactData(): Observable<any> {
    return this.http.get(`${this.contactsData}`);
  }
  updateContactData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.contactsData}/${id}`, data);
  }
  deleteContactData(id: any): Observable<any> {
    return this.http.delete(`${this.contactsData}/${id}`);
  }

  // signal methods For the search

  // updateSearchQuery(query: string) {
  //   const current = this._searchData();
  //   this._searchData.set({ ...current, searchQuery: query });
  // }

  // updatePlaceholder(placeholder: string) {
  //   const current = this._searchData();
  //   this._searchData.set({ ...current, placeholder });
  // }

  // setHideState(hide: boolean) {
  //   const current = this._searchData();
  //   this._searchData.set({ ...current, hide });thi
  // }

  setSearchConfig(data: config) {
    this._searchData.set(data);
  }
}
