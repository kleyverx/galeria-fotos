/**
 * DIRECTIVA SLIDE-IN RIGHT - ANIMACIÓN DE ENTRADA DESDE LA DERECHA
 * ================================================================
 * 
 * Esta directiva proporciona una animación de deslizamiento desde la derecha
 * que se activa automáticamente cuando el elemento entra en el viewport.
 * 
 * CASOS DE USO:
 * - Elementos de contenido principal que aparecen desde la derecha
 * - Cards y componentes en layouts alternativos
 * - Efectos de reveal progresivo en listas
 * - Elementos de navegación secundaria
 * 
 * DIFERENCIAS CON SLIDE-IN-LEFT:
 * - Posición inicial: translateX(+100px) vs translateX(-100px)
 * - Dirección de movimiento: derecha → centro vs izquierda → centro
 * - Uso típico: contenido principal vs navegación lateral
 * 
 * CARACTERÍSTICAS TÉCNICAS:
 * - **Intersection Observer**: Detección eficiente de visibilidad
 * - **Lazy Animation**: Solo anima cuando es visible (performance)
 * - **Customizable**: Duración y delay configurables
 * - **One-shot**: Anima solo una vez para mejor performance
 * - **Memory Safe**: Cleanup automático para prevenir memory leaks
 * 
 * PATRÓN DE DISEÑO:
 * - Observer Pattern: Para detección de viewport
 * - Strategy Pattern: Delegación al AnimationService
 * - Lifecycle Management: Implementa OnInit/OnDestroy correctamente
 * 
 * USO:
 * ```html
 * <div appSlideInRight [duration]="800" [delay]="200">
 *   Contenido que se desliza desde la derecha
 * </div>
 * ```
 * 
 * @author Kleyver App Team
 * @version 1.0.0
 */

// filepath: /Users/marg/Documents/ionic/kleyver-app/src/app/directives/slide-in-right.directive.ts
import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { AnimationService } from '../services/animation.service';
import { Animation } from '@ionic/angular';

/**
 * DIRECTIVA SLIDE-IN RIGHT
 * =======================
 * 
 * Directiva standalone que aplica animación de deslizamiento desde la derecha
 * usando Intersection Observer para optimizar el rendimiento.
 */
@Directive({
  selector: '[appSlideInRight]',
  standalone: true
})
export class SlideInRightDirective implements OnInit, OnDestroy {
  /**
   * DURACIÓN DE LA ANIMACIÓN
   * ========================
   * 
   * Tiempo en milisegundos que toma completar la animación.
   * Valor por defecto: 600ms (equilibrio entre velocidad y suavidad)
   * 
   * @default 600
   */
  @Input() duration: number = 600;

  /**
   * DELAY ANTES DE LA ANIMACIÓN
   * ==========================
   * 
   * Tiempo de espera en milisegundos antes de iniciar la animación
   * después de que el elemento se hace visible.
   * 
   * Útil para crear efectos escalonados cuando múltiples elementos
   * tienen diferentes delays.
   * 
   * @default 0
   */
  @Input() delay: number = 0;

  /**
   * INSTANCIA DE ANIMACIÓN IONIC
   * ============================
   * 
   * Referencia a la animación creada por el AnimationService.
   * Se mantiene para poder destruirla correctamente en cleanup.
   */
  private animation: Animation | null = null;

  /**
   * INTERSECTION OBSERVER
   * =====================
   * 
   * Observer nativo del navegador para detectar cuando el elemento
   * entra en el viewport. Más eficiente que scroll listeners.
   */
  private observer: IntersectionObserver | null = null;

  /**
   * CONSTRUCTOR - INYECCIÓN DE DEPENDENCIAS
   * =======================================
   * 
   * @param el - ElementRef del elemento DOM al que se aplica la directiva
   * @param animationService - Servicio para crear animaciones de Ionic
   */
  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  /**
   * HOOK DE INICIALIZACIÓN
   * ======================
   * 
   * Se ejecuta después de la inicialización del componente.
   * Configura el Intersection Observer para detectar cuando
   * el elemento se hace visible.
   */
  ngOnInit() {
    this.setupIntersectionObserver();
  }

  /**
   * HOOK DE DESTRUCCIÓN - CLEANUP
   * =============================
   * 
   * Cleanup crítico para prevenir memory leaks:
   * 1. Desconecta el Intersection Observer
   * 2. Destruye la instancia de animación de Ionic
   * 
   * Este cleanup es esencial en aplicaciones SPA donde
   * los componentes se crean y destruyen frecuentemente.
   */
  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animation) {
      this.animation.destroy();
    }
  }

  /**
   * CONFIGURACIÓN DEL INTERSECTION OBSERVER
   * =======================================
   * 
   * Establece la detección de visibilidad del elemento:
   * 
   * 1. **Estado Inicial**: Oculta el elemento con opacity:0 y translateX(+100px)
   *    para crear el efecto de que viene desde fuera de la pantalla por la derecha
   * 
   * 2. **Observer Configuration**:
   *    - threshold: 0.1 (se activa cuando 10% del elemento es visible)
   *    - rootMargin: '0px 0px -30px 0px' (se activa 30px antes de ser completamente visible)
   * 
   * 3. **One-shot Animation**: Después de animar, se desconecta el observer
   *    para optimizar performance (no seguir observando innecesariamente)
   * 
   * DIFERENCIA CLAVE CON SLIDE-IN-LEFT:
   * - translateX(+100px): Comienza desde la derecha de la pantalla
   * - El resto de la lógica es idéntica, manteniendo consistencia
   */
  private setupIntersectionObserver() {
    // ESTADO INICIAL: Elemento oculto y desplazado hacia la derecha
    // ============================================================
    // Esto crea la posición inicial desde donde comenzará la animación
    this.el.nativeElement.style.opacity = '0';
    this.el.nativeElement.style.transform = 'translateX(100px)'; // DERECHA: +100px

    // CONFIGURACIÓN DEL OBSERVER
    // =========================
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Aplica el delay personalizado antes de animar
          setTimeout(() => {
            this.playAnimation();
          }, this.delay);
          
          // OPTIMIZACIÓN: Deja de observar después de la primera animación
          // Esto mejora la performance ya que no necesitamos seguir detectando
          this.observer?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,           // Se activa cuando 10% del elemento es visible
      rootMargin: '0px 0px -30px 0px'  // Margen adicional para activación temprana
    });

    // Comenzar a observar el elemento
    this.observer.observe(this.el.nativeElement);
  }

  /**
   * EJECUTAR ANIMACIÓN DE SLIDE-IN RIGHT
   * ====================================
   * 
   * Delega la creación de la animación al AnimationService y la ejecuta.
   * 
   * El AnimationService maneja:
   * - La configuración específica de la animación slide-in-right
   * - Los keyframes y timing functions
   * - La transición suave desde translateX(+100px) hasta translateX(0)
   * - El cambio de opacity de 0 a 1
   * 
   * SEPARACIÓN DE RESPONSABILIDADES:
   * - Directiva: Detección de visibilidad y lifecycle
   * - AnimationService: Lógica específica de animaciones
   * 
   * Esto permite reutilizar las animaciones en otros contextos
   * y mantiene el código modular y testeable.
   */
  private playAnimation() {
    this.animation = this.animationService.createSlideInRightAnimation(
      this.el.nativeElement, 
      this.duration
    );
    this.animation.play();
  }
}