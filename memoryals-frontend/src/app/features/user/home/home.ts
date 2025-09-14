import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../../core/services/plan';
import { CommonModule, CurrencyPipe, NgForOf } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home implements OnInit{
  planes: any[] = [];

  constructor(private planService: PlanService) {}
  
  ngOnInit(): void {
    this.planService.getPlanes().subscribe((data) => {
      this.planes = data;
    });
  }

  enviarContacto() {
    // Lógica para enviar el formulario de contacto
    alert('Formulario enviado. Nos pondremos en contacto contigo pronto.');
  }
  abrirContacto(plan :any){

  }
}
