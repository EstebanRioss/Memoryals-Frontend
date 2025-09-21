import { Component, OnInit } from '@angular/core';
import { admin } from '../../../core/services/admin/admin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel-p',
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-u.html',
  styleUrls: ['./panel-u.css']
})
export class PanelU implements OnInit {
  usuarios: any[] = [];
  loading: boolean = false;
  error: string = '';
  modalVisible: boolean = false;

  usuarioSeleccionado: any = {
    nombre: '',
    email: '',
    rol: '',
    estado: ''
  };

  constructor(private adminService: admin) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.adminService.getUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los usuarios';
        console.error(err);
        this.loading = false;
      }
    });
  }

  eliminarUsuario(userId: string) {
    if (!confirm('¿Desea eliminar este usuario?')) return;
    this.adminService.deleteUsuario(userId).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => console.error('Error eliminando usuario', err)
    });
  }

  editarUsuario(usuario: any) {
    this.usuarioSeleccionado = { ...usuario }; // clonar objeto
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    // reiniciamos el objeto para no romper ngModel
    this.usuarioSeleccionado = {
      nombre: '',
      email: '',
      rol: '',
      estado: ''
    };
  }

  guardarUsuario() {
    if (!this.usuarioSeleccionado || !this.usuarioSeleccionado._id) return;

    this.adminService.updateUsuario(this.usuarioSeleccionado._id, this.usuarioSeleccionado)
      .subscribe({
        next: () => {
          this.cargarUsuarios();  // ✅ actualiza lista
          this.cerrarModal();
        },
        error: (err) => console.error('Error actualizando usuario', err)
      });
  }
}
