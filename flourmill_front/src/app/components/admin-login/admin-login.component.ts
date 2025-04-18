import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  name: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const admin = { name: this.name, password: this.password };

    this.http.post('http://localhost:8000/api/login', admin, { responseType: 'text' }).subscribe(
      response => {
        console.log(response);

        sessionStorage.setItem('isLoggedIn', 'true');

        // Navigate to dashboard on success
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.errorMessage = 'Invalid credentials';
        console.error(error);
      }
    );
  }
}
