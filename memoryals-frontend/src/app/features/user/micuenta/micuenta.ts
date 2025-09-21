import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Auth } from '../../../core/services/usuario/auth';

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  dni: string;
  rol: 'cliente' | 'admin';
  direccion?: string;
  telefono?: string;
  fechaRegistro?: string;
  plan?: string;
  fechaInicioPlan?: string;
  estadoAprobacion?: 'pendiente' | 'aprobado' | 'rechazado';
  confirmado?: boolean;
  estado?: 'activo' | 'suspendido' | 'cancelado' | 'pendiente';
}

@Component({
  selector: 'app-micuenta',
  standalone: true, // importante si usas Angular 15+ y standalone components
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './micuenta.html',
  styleUrls: ['./micuenta.css']
})
export class Micuenta implements OnInit {

  usuario!: Usuario;
  updateForm!: FormGroup;
  passwordForm!: FormGroup;

  isLoading = false;
  isPasswordLoading = false;
  mensajeExito = '';
  mensajeError = '';
  mensajeExitoPass = '';
  mensajeErrorPass = '';

  constructor(private fb: FormBuilder, private auth: Auth) {}

  ngOnInit(): void {
    const userId = this.auth.getId();
    if (!userId) return;

    this.auth.getPerfil(userId).subscribe({
      next: (data: Usuario) => {
        this.usuario = data;
        this.initForms();
      },
      error: () => {
        this.mensajeError = 'Error al cargar el perfil';
      }
    });
  }

  private initForms(): void {
    this.updateForm = this.fb.group({
      nombre: [this.usuario.nombre || '', [Validators.required, Validators.minLength(2)]],
      telefono: [this.usuario.telefono || '', [Validators.pattern(/^\d{7,15}$/)]],
      direccion: [this.usuario.direccion || '']
    });

    this.passwordForm = this.fb.group(
      {
        contrasenaActual: ['', Validators.required],
        nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', Validators.required]
      },
      { validators: this.passwordsCoinciden }
    );
  }

  private passwordsCoinciden(form: AbstractControl) {
    const nueva = form.get('nuevaContrasena')?.value;
    const confirmar = form.get('confirmarContrasena')?.value;
    return nueva === confirmar ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.usuario?._id) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    this.auth.updateUser(this.usuario._id, this.updateForm.value).subscribe({
      next: (res) => {
        this.mensajeExito = res.msg || 'Datos actualizados correctamente';
        this.isLoading = false;
        this.usuario = { ...this.usuario, ...this.updateForm.value };
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Error al actualizar';
        this.isLoading = false;
      }
    });
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.invalid || !this.usuario?._id) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isPasswordLoading = true;
    this.mensajeExitoPass = '';
    this.mensajeErrorPass = '';

    const { contrasenaActual, nuevaContrasena } = this.passwordForm.value;

    this.auth.cambiarPassword(this.usuario._id, { contrasenaActual, nuevaContrasena }).subscribe({
      next: (res) => {
        this.mensajeExitoPass = res.msg || 'Contraseña actualizada';
        this.isPasswordLoading = false;
        this.passwordForm.reset();
      },
      error: (err) => {
        this.mensajeErrorPass = err.error?.message || 'Error al cambiar contraseña';
        this.isPasswordLoading = false;
      }
    });
  }

  get nombre() { return this.updateForm.get('nombre'); }
  get telefono() { return this.updateForm.get('telefono'); }
  get direccion() { return this.updateForm.get('direccion'); }

  get contrasenaActual() { return this.passwordForm.get('contrasenaActual'); }
  get nuevaContrasena() { return this.passwordForm.get('nuevaContrasena'); }
  get confirmarContrasena() { return this.passwordForm.get('confirmarContrasena'); }
}
