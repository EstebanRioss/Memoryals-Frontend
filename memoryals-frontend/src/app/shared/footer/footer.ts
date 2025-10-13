import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Formulario } from '../../core/services/usuario/formulario';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {

  contactForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private form : Formulario) {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  goToWhatsApp(number: string = '5493884409145', message: string = 'Hola, quiero más información'): void {
    const encodedMessage: string = encodeURIComponent(message);
    const url: string = `https://wa.me/${number}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }

  sendMessage(): void {
    if (this.contactForm.valid) {
      this.form.enviarFormulario(this.contactForm.value).subscribe({
        next: (res) => {
          this.successMessage = 'Tu mensaje fue enviado correctamente.';
          this.errorMessage = '';
          this.contactForm.reset();
        },
        error: (err) => {
          console.error('Error enviando mensaje:', err);
          this.errorMessage = 'Ocurrió un error al enviar tu mensaje. Intentá de nuevo.';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Por favor completá todos los campos correctamente.';
      this.successMessage = '';
    }
  }
}
