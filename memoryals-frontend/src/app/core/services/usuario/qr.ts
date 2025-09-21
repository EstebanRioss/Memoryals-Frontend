import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Qr {
  constructor(private http: HttpClient) {}

  /**
   * Genera un QR en base64 que redirige al link de pago
   * @param pagoLink Link generado desde MercadoPago
   * @returns Observable con objeto { qrBase64 }
   */
  generarQrPago(pagoLink: string): Observable<{ qrBase64: string }> {
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(pagoLink)}&size=200x200&format=png`;

    return this.http.get(qrURL, { responseType: 'arraybuffer' }).pipe(
      map((arrayBuffer: ArrayBuffer) => {
        const base64 = `data:image/png;base64,${this.arrayBufferToBase64(arrayBuffer)}`;
        return { qrBase64: base64 };
      })
    );
  }

  /**
   * Convierte un ArrayBuffer a Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
