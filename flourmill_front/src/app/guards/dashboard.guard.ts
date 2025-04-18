/*
import { CanActivateFn } from '@angular/router';

export const dashboardGuard: CanActivateFn = (route, state) => {
  return true;
};
*/
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (!sessionStorage.getItem('isLoggedIn')) {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false;
    }
    return true; // Allow access if authenticated
  }
}