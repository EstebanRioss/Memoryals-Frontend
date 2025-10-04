import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../core/services/usuario/plan';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {
  age: number | null = null;
  allPlanes: any[] = [];
  matchedPlanes: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
    this.loadPlanes();
  }

  loadPlanes() {
    this.loading = true;
    this.planService.getPlanes().subscribe({
      next: (planes) => {
        this.allPlanes = planes || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando planes', err);
        this.error = 'No se pudieron cargar los planes.';
        this.loading = false;
      }
    });
  }

  simulate() {
    this.error = null;
    if (this.age === null || isNaN(Number(this.age))) {
      this.error = 'Ingresa una edad válida.';
      this.matchedPlanes = [];
      return;
    }

    const ageNum = Number(this.age);
    // Filtrar planes por rango de edad
    this.matchedPlanes = this.allPlanes
      .filter(p => typeof p.edadMin === 'number' && typeof p.edadMax === 'number'
        ? ageNum >= p.edadMin && ageNum <= p.edadMax
        : true)
      .map(p => ({
        ...p,
        // Convertir PrecioCoutas en objetos con número de cuotas y monto para mostrar mejor
        cuotas: Array.isArray(p.PrecioCoutas)
          ? p.PrecioCoutas.map((amount: number, i: number) => ({ instalments: i + 1, amount }))
          : []
      }));
  }

  goToWhatsApp(number: string = '5493884409145', message: string = 'Hola, quiero más información'): void {
    const encodedMessage: string = encodeURIComponent(message);
    const url: string = `https://wa.me/${number}?text=${encodedMessage}`;
    window.open(url, '_blank'); // Abre en una nueva pestaña
  }
}
