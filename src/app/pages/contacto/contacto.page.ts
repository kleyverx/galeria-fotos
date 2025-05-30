import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonText,
  IonNote,
  IonCheckbox,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { SlideInLeftDirective } from '../../directives/slide-in-left.directive';
import { SlideInRightDirective } from '../../directives/slide-in-right.directive';
import { PulseDirective } from '../../directives/pulse.directive';
import { AnimationService } from '../../services/animation.service';
import { addIcons } from 'ionicons';
import { 
  paperPlaneOutline, 
  logoInstagram, 
  logoFacebook, 
  logoTwitter, 
  logoYoutube,
  mailOutline,
  callOutline,
  locationOutline
} from 'ionicons/icons';

/**
 * Página de contacto con formulario reactivo completo
 * 
 * Características principales:
 * - Formulario reactivo con validación en tiempo real
 * - Validaciones customizadas para email y texto
 * - Feedback visual para errores con animaciones de shake
 * - Toast notifications para confirmación de envío
 * - Enlaces a redes sociales con efectos hover
 * - Integración completa con directivas de animación
 * - Responsive design para móviles y desktop
 * 
 * Patrones implementados:
 * - Reactive Forms para mejor control y validación
 * - Composition API con standalone components
 * - Feedback inmediato para mejorar UX
 * - Accesibilidad con labels y aria-labels apropiados
 */
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonText,
    IonNote,
    IonCheckbox,
    IonButton,
    IonIcon,
    FadeInDirective,
    SlideInLeftDirective,
    SlideInRightDirective,
    PulseDirective
  ]
})
export class ContactoPage implements OnInit {
  /** 
   * FormGroup principal que controla todo el formulario de contacto
   * 
   * Definido como ReactiveForm para mejor control de validaciones,
   * estado del formulario y facilidad para testing
   */
  contactForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private animationService: AnimationService
  ) { 
    /**
     * Registro de iconos específicos para esta página
     * 
     * Solo se cargan los iconos necesarios para optimizar
     * el bundle size y mejorar el rendimiento
     */
    addIcons({
      'paper-plane-outline': paperPlaneOutline,
      'logo-instagram': logoInstagram,
      'logo-facebook': logoFacebook,
      'logo-twitter': logoTwitter,
      'logo-youtube': logoYoutube,
      'mail-outline': mailOutline,
      'call-outline': callOutline,
      'location-outline': locationOutline
    });
    
    /**
     * Inicialización del formulario en el constructor
     * 
     * Se hace aquí en lugar de ngOnInit para que esté
     * disponible inmediatamente cuando se necesite
     */
    this.initForm();
  }

  ngOnInit() {
    // El formulario ya está inicializado en el constructor
    // Este hook queda disponible para futuras funcionalidades
  }
  
  /**
   * Configura el formulario reactivo con validaciones
   * 
   * Validaciones implementadas:
   * - nombre: Requerido
   * - email: Requerido y formato de email válido
   * - asunto: Valor por defecto 'info'
   * - mensaje: Requerido y mínimo 10 caracteres
   * - suscripcion: Booleano, false por defecto
   */
  private initForm(): void {
    this.contactForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['info'], // Valor por defecto
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
      suscripcion: [false] // Checkbox opcional
    });
  }

  /**
   * Getters para validación del template
   * 
   * Estos getters facilitan la verificación de estado de validación
   * en el template, proporcionando una API limpia para mostrar errores
   */
  
  /** Verifica si el campo nombre es inválido y ha sido tocado */
  get nombreInvalido() {
    const control = this.contactForm.get('nombre');
    return control && control.invalid && control.touched;
  }

  /** Verifica si el campo email es inválido y ha sido tocado */
  get emailInvalido() {
    const control = this.contactForm.get('email');
    return control && control.invalid && control.touched;
  }

  /** Verifica si el campo mensaje es inválido y ha sido tocado */
  get mensajeInvalido() {
    const control = this.contactForm.get('mensaje');
    return control && control.invalid && control.touched;
  }

  /**
   * Procesa el envío del formulario de contacto
   * 
   * Proceso completo:
   * 1. Valida que el formulario esté correcto
   * 2. Si es válido: muestra animación, toast de confirmación y resetea
   * 3. Si es inválido: marca campos como tocados y anima shake de error
   * 
   * En una implementación real, aquí se enviarían los datos
   * a un servidor o servicio de email
   */
  async enviarMensaje() {
    if (this.contactForm.valid) {
      // Log para debugging (en producción se enviaría a servidor)
      console.log('Formulario enviado:', this.contactForm.value);
      
      /**
       * Animación de feedback positivo
       * 
       * Proporciona confirmación visual inmediata al usuario
       * de que su acción fue registrada exitosamente
       */
      const submitButton = document.querySelector('.submit-button');
      if (submitButton) {
        const animation = this.animationService.createPulseAnimation(submitButton as HTMLElement, 300);
        animation.play();
        setTimeout(() => {
          animation.stop();
          animation.destroy();
        }, 300);
      }
      
      /**
       * Toast de confirmación
       * 
       * Notificación no intrusiva que confirma el envío exitoso
       * Se posiciona en la parte inferior para no interferir con el contenido
       */
      const toast = await this.toastController.create({
        message: 'Mensaje enviado correctamente. Gracias por contactarme.',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
      
      /**
       * Reset del formulario
       * 
       * Limpia todos los campos pero mantiene valores por defecto
       * para asunto y suscripción, mejorando la UX
       */
      this.contactForm.reset({
        asunto: 'info',
        suscripcion: false
      });
    } else {
      /**
       * Manejo de formulario inválido
       * 
       * 1. Marca todos los campos como tocados para activar validaciones visuales
       * 2. Aplica animación de shake para feedback negativo claro
       */
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      
      /**
       * Animación de error
       * 
       * El shake indica claramente que algo está mal sin ser agresivo
       * Ayuda a dirigir la atención del usuario a los errores de validación
       */
      const formContainer = document.querySelector('.form-container');
      if (formContainer) {
        const shakeAnimation = this.animationService.createShakeAnimation(formContainer as HTMLElement);
        shakeAnimation.play();
      }
    }
  }
}
