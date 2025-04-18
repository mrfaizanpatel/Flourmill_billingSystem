/*
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      // If logged in, redirect to dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
*/
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import { SessionStorageService } from '../services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (sessionStorage.getItem('isLoggedIn')) {
      this.router.navigate(['/dashboard']); // Redirect to dashboard if already logged in
      return false;
    }
    return true; // Allow access to login page if not logged in
  }
}