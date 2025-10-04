import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {
  @ViewChildren('revealCard', { read: ElementRef }) revealCards!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    if (!('IntersectionObserver' in window)) {
      // fallback: make all visible
      this.revealCards.forEach((el) => el.nativeElement.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    this.revealCards.forEach((el) => {
      observer.observe(el.nativeElement);
    });
  }
}
