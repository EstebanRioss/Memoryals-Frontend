import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';  // 🔹 Importar Router
import { Auth } from '../../../core/services/usuario/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router   // 🔹 Inyectar Router acá
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('Login exitoso ✅', res);
        this.loading = false;

        // 🔹 Redirigir según rol
        if (res.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/inicio']);
        }
      },
      error: (err) => {
        // 🔹 Mostrar mensaje claro de credenciales incorrectas
        this.errorMessage = '¡Credenciales incorrectas! Por favor, revisá tu email y contraseña.';
        this.loading = false;
      }
    });
  }
}

