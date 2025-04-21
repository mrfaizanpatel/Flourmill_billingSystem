import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  name: string = '';
  password: string = '';
  errorMessage: string = '';

  // constructor(private http: HttpClient, private router: Router) {}
  constructor(private userService: UserService,private router:Router,private fb: FormBuilder,private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      role: ['Customer'],
      status: ['Active'],
      joinedDate: [new Date()],
      username: ['', Validators.required],
      password: ['', Validators.required],
      notes: ['']
    });
  }

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
  
isSignupMode = false;

loginForm!: FormGroup;
signupForm!: FormGroup;
message = '';

makesignupvisible(){
  this.isSignupMode=true;
  this.onSignupSubmit();
}

// constructor(private fb: FormBuilder, private signupService: SignupService, private authService: AuthService) {
//   this.loginForm = this.fb.group({
//     username: ['', Validators.required],
//     password: ['', Validators.required]
//   });

//   this.signupForm = this.fb.group({
//     fullName: ['', Validators.required],
//     email: ['', [Validators.required, Validators.email]],
//     phoneNumber: [''],
//     address: [''],
//     role: ['Customer'],
//     status: ['Active'],
//     joinedDate: [new Date()],
//     username: ['', Validators.required],
//     password: ['', Validators.required],
//     notes: ['']
//   });
// }

// toggleMode() {
//   this.isSignupMode = !this.isSignupMode;
//   this.message = '';
// }

onLoginSubmit() {
  if (this.loginForm.valid) {
    this.userService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.message = 'Login successful';
      },
      error: (err) => {
        this.message = 'Login failed';
      }
    });
  }
}

onSignupSubmit() {
  if (this.signupForm.valid) {
    this.userService.signup(this.signupForm.value).subscribe({
      next: () => {
        this.message = 'Signup successful';
        this.signupForm.reset();
        this.isSignupMode = false;
      },
      error: err => {
        this.message = 'Signup failed';
      }
    });
  }
}
}
