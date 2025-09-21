import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PlanService } from '../../../core/services/plan';
import { CommonModule, NgForOf } from '@angular/common'; // Added NgForOf

// Declare Swiper as a global variable
declare const Swiper: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgForOf], // Added NgForOf
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home implements OnInit, AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  planes: any[] = [];
  testimonios = [
    { texto: "En un momento tan difícil, el equipo de Memoryals nos brindó una paz y una tranquilidad invaluables. Su profesionalismo y calidez humana hicieron toda la diferencia. Estamos profundamente agradecidos.", autor: "Familia Gómez" },
    { texto: "Contratar Memoryals fue la mejor decisión. La gestión fue impecable y el acompañamiento constante. Un servicio excelente que superó nuestras expectativas.", autor: "Juan Carlos P." },
    { texto: "No sabía qué esperar, pero el respaldo de Memoryals fue total. Se encargaron de todo con un respeto y una eficiencia admirables. Los recomiendo sin dudarlo.", autor: "Sofía L." },
    { texto: "La tranquilidad de saber que mi familia no tendrá que preocuparse por nada en el futuro no tiene precio. El plan es accesible y el servicio es de primera.", autor: "Marta R." }
  ];

  constructor(private planService: PlanService) {}
  
  ngOnInit(): void {
    this.planService.getPlanes().subscribe((data) => {
      this.planes = data;
    });
  }

  ngAfterViewInit(): void {
    if (this.heroVideo) {
      const video = this.heroVideo.nativeElement;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.play().catch(error => {
        console.error('Error trying to play video:', error);
      });
    }

    // Initialize Swiper
    if (typeof Swiper !== 'undefined') { // Check if Swiper is loaded
      new Swiper('.testimonial-swiper', {
        // Configuración básica
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        loopAdditionalSlides: 1, // Reduce el número de slides duplicados
        watchSlidesProgress: true,
        resistance: false, // Mejora el rendimiento en dispositivos táctiles
        
        // Mejoras de rendimiento
        preloadImages: false,
        updateOnImagesReady: false,
        lazy: true,
        
        // Navegación
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        
        // Paginación
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true, // Mejora el rendimiento de la paginación
        },
        
        // Autoplay optimizado
        autoplay: {
          delay: 4000, // Reducido de 5000ms a 4000ms
          disableOnInteraction: false,
          waitForTransition: false, // Mejora el rendimiento
        },
        
        // Efectos optimizados
        speed: 600, // Velocidad de transición reducida
        effect: 'slide', // Efecto más ligero
        
        // Breakpoints responsivos
        breakpoints: {
          // when window width is >= 640px
          640: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 25
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
            centeredSlides: true // Solo centrar en pantallas grandes
          }
        }
      });
    } else {
      console.error('Swiper library not loaded.');
    }
  }

  enviarContacto() {
    // Lógica para enviar el formulario de contacto
    alert('Formulario enviado. Nos pondremos en contacto contigo pronto.');
  }
  abrirContacto(plan :any){

  }
}