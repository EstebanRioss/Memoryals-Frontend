import { Component, OnInit } from '@angular/core';
import { Pagos } from '../../../core/services/usuario/pagos';
import { CommonModule } from '@angular/common';
import { Qr } from '../../../core/services/usuario/qr';
@Component({
  selector: 'app-micuota',
  imports: [CommonModule],
  templateUrl: './micuota.html',
  styleUrl: './micuota.css'
})
export class Micuota implements OnInit {
  pagos: any[] = [];
  pagoActual: any;
  qrBase64: string = '';
  pagoLink: string = '';
  mostrarQr: boolean = false;

  constructor(private pagosService: Pagos , private qr : Qr) {}

  ngOnInit() {
    const userId = localStorage.getItem('id'); // o desde tu auth
    if (userId) {
      this.cargarPagos(userId);
    }
  }

  // Carga pagos del usuario y define el pendiente actual
  private cargarPagos(userId: string) {
    this.pagosService.getPagosUsuario(userId).subscribe({
      next: pagos => {
        this.pagos = pagos;
        this.pagoActual = pagos.find((p: { estado: string; }) => p.estado === 'pendiente');
      },
      error: err => console.error('Error al obtener pagos', err)
    });
  }

  // Genera el link de pago y abre MercadoPago
  pagar(pago: any) {
    const userId = localStorage.getItem('id');
    if (!userId) return;

    this.pagosService.generarLinkPago(userId).subscribe({
      next: res => {
        if (res.pagoLink) {
          this.pagoLink = res.pagoLink;
          this.qr.generarQrPago(this.pagoLink).subscribe({
            next: qrRes => {
              this.qrBase64 = qrRes.qrBase64;
              this.mostrarQr = true;
            },
            error : err => console.error('Error generando QR', err)
          })
        } else {
          console.warn('No se pudo generar link de pago');
        }
      },
      error: err => console.error('Error generando link de pago', err)
    });
  }

  cerrarQR() {
    this.mostrarQr = false;
    this.qrBase64 = '';
    this.pagoLink = '';
  }
}
