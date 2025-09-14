import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth as AuthService } from '../../core/services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  isMenuOpen = false;
  isDropdownOpen = false;
  user: any = null;
  authSub?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // 🔹 Suscribirse a los cambios de usuario
    this.authSub = this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      if (!user) {
        // 🔹 cerrar menú y dropdown cuando se cierre sesión
        this.isMenuOpen = false;
        this.isDropdownOpen = false;
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
