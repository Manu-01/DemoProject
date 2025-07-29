import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:3000/task';
  private orgUrl = 'http://localhost:3000/organization';
  private conatactUrl = 'http://localhost:3000/contacts';
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
    return this.http.get(`${this.orgUrl}`);
  }

  // ContactData
  getContactData(): Observable<any> {
    return this.http.get(`${this.conatactUrl}`);
  }
  UpdateData(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.conatactUrl}/${id}`, data);
  }
}
