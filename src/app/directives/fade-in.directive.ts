import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { AnimationService } from '../services/animation.service';
import { Animation } from '@ionic/angular';

/**
 * Directiva para crear animaciones de aparición gradual (fade-in)
 * 
 * Funcionalidades:
 * - Detección automática cuando el elemento entra en el viewport
 * - Configuración personalizable de duración y delay
 * - Múltiples triggers: automático, click, hover
 * - Optimizada para rendimiento con Intersection Observer
 * 
 * Uso en template:
 * <div appFadeIn [duration]="600" [delay]="200">Contenido</div>
 * <div appFadeIn trigger="click">Click para animar</div>
 * <div appFadeIn trigger="hover">Hover para animar</div>
 */
@Directive({
  selector: '[appFadeIn]',
  standalone: true
})
export class FadeInDirective implements OnInit, OnDestroy {
  /** Duración de la animación en milisegundos */
  @Input() duration: number = 500;
  
  /** Delay antes de iniciar la animación en milisegundos */
  @Input() delay: number = 0;
  
  /** 
   * Tipo de trigger para la animación:
   * - 'auto': Se ejecuta cuando el elemento es visible (Intersection Observer)
   * - 'click': Se ejecuta al hacer click en el elemento
   * - 'hover': Se ejecuta al hacer hover sobre el elemento
   */
  @Input() trigger: string = 'auto';

  private animation: Animation | null = null;
  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  ngOnInit() {
    // Configurar el tipo de trigger según la opción seleccionada
    if (this.trigger === 'auto') {
      this.setupIntersectionObserver();
    } else if (this.trigger === 'click') {
      this.el.nativeElement.addEventListener('click', () => this.playAnimation());
    } else if (this.trigger === 'hover') {
      this.el.nativeElement.addEventListener('mouseenter', () => this.playAnimation());
    }
  }

  ngOnDestroy() {
    // Cleanup para evitar memory leaks
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animation) {
      this.animation.destroy();
    }
  }

  /**
   * Configura el Intersection Observer para trigger automático
   * 
   * El Intersection Observer es más eficiente que usar scroll listeners
   * ya que no bloquea el hilo principal y solo se ejecuta cuando
   * el elemento realmente cambia su intersección con el viewport
   */
  private setupIntersectionObserver() {
    // Establecer estado inicial: elemento invisible
    // Esto evita el "flash" de contenido visible antes de la animación
    this.el.nativeElement.style.opacity = '0';
    this.el.nativeElement.style.transform = 'translateY(20px)';

    // Crear Intersection Observer para detectar visibilidad
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Aplicar delay personalizado si se especifica
          setTimeout(() => {
            this.playAnimation();
          }, this.delay);
          
          // Dejar de observar una vez que se anima (one-time animation)
          this.observer?.unobserve(entry.target);
        }
      });
    }, {
      // Configuración del observer:
      threshold: 0.1, // Se activa cuando 10% del elemento es visible
      rootMargin: '0px 0px -50px 0px' // Margen negativo para activar antes de que sea completamente visible
    });

    this.observer.observe(this.el.nativeElement);
  }

  /**
   * Ejecuta la animación usando el servicio de animaciones
   * 
   * Delega la creación de la animación al AnimationService
   * para mantener consistencia en toda la aplicación
   */
  private playAnimation() {
    this.animation = this.animationService.createFadeInAnimation(
      this.el.nativeElement, 
      this.duration
    );
    this.animation.play();
  }
}