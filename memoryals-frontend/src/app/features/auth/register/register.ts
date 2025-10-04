import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/usuario/auth';
import { PlanService } from '../../../core/services/usuario/plan';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm!: FormGroup;
  codeForm!: FormGroup;

  planes: any[] = [];
  selectedPlan: any = null;
  selectedCuota: number | null = null;

  isCodeStep = false;
  isVerified = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private planService: PlanService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      rol: ['cliente'],
      planId: [null, Validators.required], // nuevo
      Monto: [null, Validators.required]   // nuevo
    });

    this.planService.getPlanes().subscribe({
      next: (res) => this.planes = res,
      error: (err) => console.error('Error al traer planes:', err)
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
    console.log(this.registerForm.value);
    const formValue = { ...this.registerForm.value };
    formValue.Monto = Number(formValue.Monto); // convertir a número

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

  onBirthDateChange() {
    const fechaNacimiento = this.registerForm.value.fechaNacimiento;
    if (!fechaNacimiento) return;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    // Buscar plan según edad
    this.selectedPlan = this.planes.find(p => edad >= p.edadMin && edad <= p.edadMax) || null;
    this.selectedCuota = null;

    // Setear planId en el form
    this.registerForm.patchValue({
      planId: this.selectedPlan?._id || null,
      Monto: null
    });
  }

}
