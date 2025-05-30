import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { AnimationService } from '../services/animation.service';
import { Animation } from '@ionic/angular';

/**
 * Directiva para crear efectos de latido/pulso continuo
 * 
 * Ideal para:
 * - Botones de llamada a la acción
 * - Íconos de favoritos activos
 * - Elementos que requieren atención constante
 * - Indicadores de estado activo
 * 
 * Características:
 * - Animación infinita configurable
 * - Múltiples triggers (auto, hover, click)
 * - Control programático start/stop
 * - Cleanup automático para evitar memory leaks
 * 
 * Uso:
 * <ion-button appPulse [duration]="800">¡Importante!</ion-button>
 * <ion-icon appPulse trigger="hover" name="heart"></ion-icon>
 */
@Directive({
  selector: '[appPulse]',
  standalone: true
})
export class PulseDirective implements OnInit, OnDestroy {
  /** Duración de un ciclo de pulso en milisegundos */
  @Input() duration: number = 1000;
  
  /** Si debe comenzar automáticamente al inicializarse */
  @Input() autoStart: boolean = true;
  
  /** 
   * Tipo de trigger:
   * - 'auto': Inicia automáticamente si autoStart es true
   * - 'hover': Anima solo durante hover
   * - 'click': Toggle al hacer click
   */
  @Input() trigger: string = 'auto';

  private animation: Animation | null = null;
  private isPlaying: boolean = false;

  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  ngOnInit() {
    // Configurar comportamiento según el trigger
    if (this.trigger === 'auto' && this.autoStart) {
      this.startAnimation();
    } else if (this.trigger === 'hover') {
      // Pulso solo durante hover
      this.el.nativeElement.addEventListener('mouseenter', () => this.startAnimation());
      this.el.nativeElement.addEventListener('mouseleave', () => this.stopAnimation());
    } else if (this.trigger === 'click') {
      // Toggle con cada click
      this.el.nativeElement.addEventListener('click', () => this.toggleAnimation());
    }
  }

  ngOnDestroy() {
    // Importante: detener animación en cleanup para evitar memory leaks
    this.stopAnimation();
  }

  /**
   * Inicia la animación de pulso
   * 
   * Solo inicia si no está ya reproduciéndose para evitar
   * múltiples animaciones simultáneas en el mismo elemento
   */
  private startAnimation() {
    if (!this.isPlaying) {
      this.animation = this.animationService.createPulseAnimation(
        this.el.nativeElement, 
        this.duration
      );
      this.animation.play();
      this.isPlaying = true;
    }
  }

  /**
   * Detiene la animación de pulso
   * 
   * Limpia la animación, libera memoria y resetea el elemento
   * a su estado visual original (escala 1)
   */
  private stopAnimation() {
    if (this.animation && this.isPlaying) {
      this.animation.stop();
      this.animation.destroy();
      this.animation = null;
      this.isPlaying = false;
      
      // Resetear transformación para evitar que quede en estado intermedio
      this.el.nativeElement.style.transform = 'scale(1)';
    }
  }

  /**
   * Alterna el estado de la animación (play/stop)
   * 
   * Útil para implementar controles de usuario que permitan
   * activar/desactivar el efecto de pulso
   */
  private toggleAnimation() {
    if (this.isPlaying) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  }

  /**
   * Métodos públicos para control programático desde componentes
   * 
   * Permiten que los componentes padre controlen la animación
   * mediante ViewChild o referencias del template
   */
  public start() {
    this.startAnimation();
  }

  public stop() {
    this.stopAnimation();
  }
}