import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = '/api'; // proxy handles /api

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getallcust`,{responseType:'json'});
  }

  // Add a new user (customer)
  addUser(customer: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/savecust`, customer);
  }

  // Update an existing user (PUT request)
  updateUser(customer: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/updatdebyid/${customer.cust_id}`, customer);
  }
//delete cust by id
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deletebyid/${id}`);
  }

  //gettransactions
  getTransactionsByCustomerId(custId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/transactionsbycustid/customer/${custId}`);
  }
  
  //editupdatetransaction
  // updateTransaction(id: number, updatedData: any): Observable<any> {
  //   return this.http.put(`/api/updattransactiondebyid/${id}`, updatedData);
  // }
  //get transaction by id
  getTransactionById(id: number) {
    return this.http.get<any>(`/api/gettransactionbyid/${id}`);
  }
//update transaction by id
  updateTransaction(id: number, data: any) {
    return this.http.put(`/api/updattransactiondebyid/${id}`, data);
  }
  //delete transaction by id
  deleteTransaction(id: number) {
    return this.http.delete(`/api/deletetransactionbyid/${id}`);
  }
  
  //add transaction
  addTransaction(transactionData: any) {
    return this.http.post(`${this.baseUrl}/savetransaction`, transactionData);
  }

  //getalltransactions
  getalltransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getalltransaction`,{responseType:'json'});
  }
private loginUrl="/api";
   // 🔐 Login user
   login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials);
  }

  private signupUrl="/api";
  // 📝 Signup user (as member)
  signup(memberData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/savemember`, memberData);
  }
}
