import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/usuario/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm!: FormGroup;
  codeForm!: FormGroup;

  isCodeStep = false;
  isVerified = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      rol: ['cliente']
    });

    this.codeForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = res.message || 'Registro exitoso. Revisa tu correo.';
        this.isCodeStep = true;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al registrar.';
      }
    });
  }

  onVerifyCode() {
    if (this.codeForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const token = this.codeForm.value.token;

    this.authService.confirmEmail(token).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.isVerified = true;
        this.successMessage = res.message || res.msg || 'Cuenta confirmada con éxito.';
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || err.error?.msg || 'Error al confirmar la cuenta.';
      }
    });
  }
}
