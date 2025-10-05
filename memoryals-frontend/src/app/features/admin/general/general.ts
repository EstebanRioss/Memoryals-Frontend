import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { admin } from '../../../core/services/admin/admin';

@Component({
  selector: 'app-general',
  imports: [CommonModule],
  templateUrl: './general.html',
  styleUrl: './general.css'
})
export class General implements OnInit {
  totalPagos: number = 0;
  totalUsuarios: number = 0;
  loading: boolean = true;
  error: string = '';

  
  constructor(private adminService: admin) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;

    // 1. Traer todos los pagos
    this.adminService.getAllPagos().subscribe({
      next: (pagos) => {
        // ✅ Filtrar solo los pagados
        const pagosPagados = pagos.filter((p: any) => p.estado?.toLowerCase() === 'pagada');
        // ✅ Sumar los montos de los pagos pagados
        this.totalPagos = pagosPagados.reduce((acc: number, p: any) => acc + (p.monto || 0), 0);

        // 2. Luego traer todos los usuarios
        this.adminService.getUsuarios().subscribe({
          next: (usuarios) => {
            this.totalUsuarios = usuarios.length;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Error al cargar usuarios';
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Error al cargar pagos';
        console.error(err);
        this.loading = false;
      }
    });
  }


}
