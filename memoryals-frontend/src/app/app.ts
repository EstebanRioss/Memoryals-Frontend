import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { CommonModule } from '@angular/common';
import { ChatWidget } from './shared/chat-widget/chat-widget';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, RouterModule, CommonModule, ChatWidget],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('memoryals-frontend');

  constructor(private router: Router) {
    // 🔥 Cuando cambia la ruta, vuelve al inicio de la página
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
}
