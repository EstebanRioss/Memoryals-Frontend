import { Component, OnInit } from '@angular/core';
import { admin } from '../../../core/services/admin/admin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel-p',
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-p.html',
  styleUrls: ['./panel-p.css']
})
export class PanelP implements OnInit{
  pagos: any[] = [];
  loading: boolean = false;
  error: string = '';
  modalVisible: boolean = false;
  pagoSeleccionado: any = {
    usuario: '',
    plan: '',
    mes: '',
    anio: '',
    monto: 0,
    estado: '',
    metodoPago: ''
  };
  constructor(private adminService: admin) {}
  ngOnInit(): void {
    this.cargarPagos();
  }
  cargarPagos() {
    this.loading = true;
    this.adminService.getAllPagos().subscribe({
      next: (res) => {
        this.pagos = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los pagos';
        console.error(err);
        this.loading = false;
      }
    });
  }

  editarPago(pago: any) {
    this.pagoSeleccionado = { ...pago }; // clonar objeto
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.pagoSeleccionado = {
      usuario: '',
      plan: '',
      mes: '',
      anio: '',
      monto: 0,
      estado: '',
      metodoPago: ''
    };
  }

  guardarPago() {
    if (!this.pagoSeleccionado || !this.pagoSeleccionado._id) return;

    this.adminService.updatePago(this.pagoSeleccionado._id, this.pagoSeleccionado)
      .subscribe({
        next: () => {
          this.cargarPagos();  // ✅ actualizar lista
          this.cerrarModal();
        },
        error: (err) => console.error('Error actualizando pago', err)
      });
  }

  eliminarPago(pagoId: string) {
    if (!confirm('¿Desea eliminar este pago?')) return;
    this.adminService.deletePago(pagoId).subscribe({
      next: () => this.cargarPagos(),
      error: (err) => console.error('Error eliminando pago', err)
    });
  }
}
