import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {

  goToWhatsApp(number: string = '5493884409145', message: string = 'Hola, quiero más información'): void {
    const encodedMessage: string = encodeURIComponent(message);
    const url: string = `https://wa.me/${number}?text=${encodedMessage}`;
    window.open(url, '_blank'); // Abre en una nueva pestaña
  }

}