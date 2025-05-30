import { Injectable } from '@angular/core';
import { AnimationController, Animation } from '@ionic/angular';

/**
 * Servicio centralizado para crear y gestionar animaciones personalizadas
 * 
 * Este servicio encapsula la lógica de animaciones usando el AnimationController
 * de Ionic, proporcionando una API consistente para diferentes tipos de animaciones.
 * 
 * Beneficios:
 * - Reutilización de animaciones en toda la app
 * - Configuración centralizada de timings y easings
 * - Animaciones optimizadas para rendimiento móvil
 * - Consistencia visual en toda la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor(private animationCtrl: AnimationController) { }

  /**
   * Crea una animación de aparición gradual con movimiento vertical
   * 
   * Ideal para: elementos que aparecen en pantalla, modales, tarjetas
   * 
   * @param element - Elemento DOM a animar
   * @param duration - Duración en milisegundos (default: 500ms)
   * @returns Animation - Objeto de animación de Ionic
   */
  createFadeInAnimation(element: HTMLElement, duration: number = 500): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(duration)
      .easing('ease-in-out') // Suave entrada y salida
      .fromTo('opacity', '0', '1') // Fade in
      .fromTo('transform', 'translateY(20px)', 'translateY(0px)'); // Movimiento sutil hacia arriba
  }

  /**
   * Animación de entrada desde la izquierda
   * 
   * Ideal para: navegación, elementos de menú, contenido que entra de lado
   * 
   * @param element - Elemento DOM a animar
   * @param duration - Duración en milisegundos (default: 600ms)
   * @returns Animation - Objeto de animación de Ionic
   */
  createSlideInLeftAnimation(element: HTMLElement, duration: number = 600): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(duration)
      .easing('cubic-bezier(0.4, 0, 0.2, 1)') // Material Design easing
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateX(-100px)', 'translateX(0px)');
  }

  /**
   * Animación de entrada desde la derecha
   * 
   * Simétrica a slideInLeft, útil para navegación bidireccional
   * 
   * @param element - Elemento DOM a animar
   * @param duration - Duración en milisegundos (default: 600ms)
   * @returns Animation - Objeto de animación de Ionic
   */
  createSlideInRightAnimation(element: HTMLElement, duration: number = 600): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(duration)
      .easing('cubic-bezier(0.4, 0, 0.2, 1)')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateX(100px)', 'translateX(0px)');
  }

  /**
   * Animación de escalado con efecto de zoom
   * 
   * Ideal para: botones, íconos de favoritos, elementos interactivos
   * Usa un easing con rebote para un efecto más dinámico
   * 
   * @param element - Elemento DOM a animar
   * @param duration - Duración en milisegundos (default: 400ms)
   * @returns Animation - Objeto de animación de Ionic
   */
  createScaleInAnimation(element: HTMLElement, duration: number = 400): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(duration)
      .easing('cubic-bezier(0.175, 0.885, 0.32, 1.275)') // Easing con rebote
      .fromTo('opacity', '0', '1')
            .fromTo('transform', 'scale(0.8)', 'scale(1)');
  }

  /**
   * Animación de rebote con keyframes complejos
   * 
   * Simula el efecto de un objeto que cae y rebota.
   * Ideal para: notificaciones, elementos que necesitan llamar la atención
   * 
   * @param element - Elemento DOM a animar
   * @param duration - Duración en milisegundos (default: 800ms)
   * @returns Animation - Objeto de animación de Ionic
   */
  createBounceAnimation(element: HTMLElement, duration: number = 800): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(duration)
      .keyframes([
        { offset: 0, transform: 'translateY(0px)', opacity: '0' },
        { offset: 0.2, transform: 'translateY(-30px)', opacity: '1' }, // Rebote principal
        { offset: 0.4, transform: 'translateY(0px)' },
        { offset: 0.6, transform: 'translateY(-15px)' }, // Rebote secundario
        { offset: 0.8, transform: 'translateY(0px)' },
        { offset: 1, transform: 'translateY(0px)', opacity: '1' }
      ]);
  }

  /**
   * Animación de latido continuo
   * 
   * Ideal para: botones de llamada a la acción, elementos que necesitan
   * atención constante (ej: corazón de favoritos)
   * 
   * Nota: Se ejecuta infinitamente hasta que se detenga manualmente
   * 
   * @param element - Elemento DOM a animar
   * @param duration - Duración de un ciclo en milisegundos (default: 1000ms)
   * @returns Animation - Objeto de animación de Ionic
   */
  createPulseAnimation(element: HTMLElement, duration: number = 1000): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(duration)
      .iterations(Infinity) // Loop infinito
      .easing('ease-in-out')
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.5, transform: 'scale(1.05)' }, // Expansión sutil
        { offset: 1, transform: 'scale(1)' }
      ]);
  }

  /**
   * Animación de temblor para indicar errores
   * 
   * Ideal para: validación de formularios, errores de entrada,
   * feedback negativo al usuario
   * 
   * @param element - Elemento DOM a animar
   * @param duration - Duración en milisegundos (default: 500ms)
   * @returns Animation - Objeto de animación de Ionic
   */
  createShakeAnimation(element: HTMLElement, duration: number = 500): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(duration)
      .easing('ease-in-out')
      .keyframes([
        { offset: 0, transform: 'translateX(0)' },
        { offset: 0.1, transform: 'translateX(-10px)' },
        { offset: 0.2, transform: 'translateX(10px)' },
        { offset: 0.3, transform: 'translateX(-10px)' },
        { offset: 0.4, transform: 'translateX(10px)' },
        { offset: 0.5, transform: 'translateX(-10px)' },
        { offset: 0.6, transform: 'translateX(10px)' },
        { offset: 0.7, transform: 'translateX(-10px)' },
                { offset: 0.8, transform: 'translateX(10px)' },
        { offset: 0.9, transform: 'translateX(-10px)' },
        { offset: 1, transform: 'translateX(0)' } // Vuelve a posición original
      ]);
  }

  /**
   * Animación de rotación completa
   * 
   * Ideal para: íconos de recarga, loading spinners, elementos decorativos
   * 
   * @param element - Elemento DOM a animar
   * @param duration - Duración en milisegundos (default: 600ms)
   * @returns Animation - Objeto de animación de Ionic
   */
  createRotateAnimation(element: HTMLElement, duration: number = 600): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(duration)
      .easing('ease-in-out')
      .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)');
  }

  /**
   * Animación de volteo en el eje Y
   * 
   * Ideal para: tarjetas que muestran información en ambas caras,
   * toggle de estado, efectos de revelación
   * 
   * @param element - Elemento DOM a animar
   * @param duration - Duración en milisegundos (default: 600ms)
   * @returns Animation - Objeto de animación de Ionic
   */
  createFlipAnimation(element: HTMLElement, duration: number = 600): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(duration)
      .easing('ease-in-out')
      .keyframes([
        { offset: 0, transform: 'rotateY(0deg)' },
        { offset: 0.5, transform: 'rotateY(90deg)' }, // Punto medio del flip
        { offset: 1, transform: 'rotateY(0deg)' }
      ]);
  }

  /**
   * Crea animaciones escalonadas para múltiples elementos
   * 
   * Ideal para: listas de elementos, grids de tarjetas, galerías
   * Cada elemento aparece con un pequeño delay respecto al anterior,
   * creando un efecto de cascada muy atractivo visualmente
   * 
   * @param elements - Array de elementos DOM a animar
   * @param delay - Delay entre cada elemento en ms (default: 100ms)
   * @returns Animation[] - Array de animaciones para cada elemento
   */
  createStaggeredCardAnimation(elements: HTMLElement[], delay: number = 100): Animation[] {
    return elements.map((element, index) => {
      return this.animationCtrl
        .create()
        .addElement(element)
        .duration(500)
        .delay(index * delay) // Cada elemento tiene más delay que el anterior
        .easing('cubic-bezier(0.4, 0, 0.2, 1)')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(30px) scale(0.95)', 'translateY(0) scale(1)');
    });
  }

  /**
   * Animación específica para elementos de lista
   * 
   * Optimizada para listas largas donde queremos un efecto sutil
   * pero visible de aparición secuencial
   * 
   * @param element - Elemento DOM a animar
   * @param index - Índice del elemento en la lista (para calcular delay)
   * @returns Animation - Objeto de animación de Ionic
   */
  createListItemAnimation(element: HTMLElement, index: number): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(400)
            .delay(index * 50) // Delay más corto para listas
      .easing('ease-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateX(-20px)', 'translateX(0)');
  }

  /**
   * Animación para efectos hover en botones
   * 
   * Proporciona feedback visual inmediato al usuario
   * cuando interactúa con elementos clickeables
   * 
   * @param element - Elemento DOM a animar
   * @returns Animation - Objeto de animación de Ionic
   */
  createButtonHoverAnimation(element: HTMLElement): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(200) // Muy rápido para feedback inmediato
      .easing('ease-out')
      .fromTo('transform', 'scale(1)', 'scale(1.05)');
  }

  /**
   * Animación de loading spinner personalizada
   * 
   * Alternativa a los spinners por defecto de Ionic
   * Rotación continua hasta que se detenga manualmente
   * 
   * @param element - Elemento DOM a animar
   * @returns Animation - Objeto de animación de Ionic
   */
  createLoadingAnimation(element: HTMLElement): Animation {
    return this.animationCtrl
      .create()
      .addElement(element)
      .duration(1000)
      .iterations(Infinity) // Loop infinito
      .easing('linear') // Velocidad constante para rotación suave
      .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)');
  }

  /**
   * Método helper para ejecutar animaciones en secuencia
   * 
   * Útil cuando queremos animar varios elementos con intervalos específicos
   * sin crear animaciones complejas con keyframes
   * 
   * @param animations - Array de animaciones a ejecutar
   * @param interval - Intervalo entre cada animación en ms (default: 100ms)
   */
  animateSequence(animations: Animation[], interval: number = 100): void {
    animations.forEach((animation, index) => {
      setTimeout(() => {
        animation.play();
      }, index * interval);
    });
  }

  /**
   * Crea transiciones entre páginas
   * 
   * Implementa el patrón común de entrada/salida de páginas
   * donde la página saliente se mueve hacia la izquierda
   * mientras la entrante viene desde la derecha
   * 
   * @param enteringElement - Elemento de la página que entra
   * @param leavingElement - Elemento de la página que sale (opcional)
   * @returns Animation - Animación combinada o solo de entrada
   */
  createPageTransition(enteringElement: HTMLElement, leavingElement?: HTMLElement): Animation {
    // Animación de la página que entra
    const enterAnimation = this.animationCtrl
      .create()
      .addElement(enteringElement)
      .duration(300)
      .easing('cubic-bezier(0.4, 0, 0.2, 1)') // Material Design easing
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateX(30px)', 'translateX(0)');

    // Si hay página saliente, crear animación combinada
    if (leavingElement) {
      const leaveAnimation = this.animationCtrl
        .create()
        .addElement(leavingElement)
        .duration(300)
        .easing('cubic-bezier(0.4, 0, 0.2, 1)')
        .fromTo('opacity', '1', '0')
        .fromTo('transform', 'translateX(0)', 'translateX(-30px)');

      // Combinar ambas animaciones para ejecutar simultáneamente
      return this.animationCtrl
        .create()
        .addAnimation([enterAnimation, leaveAnimation]);
    }

    return enterAnimation;
  }
}