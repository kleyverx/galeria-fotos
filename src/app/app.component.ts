/**
 * KLEYVER APP - COMPONENTE RAÍZ DE LA APLICACIÓN
 * ===============================================
 * 
 * Este es el componente principal de la aplicación Ionic "Kleyver App".
 * Funciona como el contenedor raíz que:
 * 
 * 1. **Configuración Global de Iconos**: Registra todos los iconos de Ionicons
 *    que serán utilizados en toda la aplicación
 * 
 * 2. **Gestión de Navegación**: Define la estructura de navegación principal
 *    con pestañas (tabs) para las páginas: Inicio, Sobre Mí y Contacto
 * 
 * 3. **Sistema de Temas**: Proporciona controles para cambiar entre temas
 *    claro, oscuro y automático (sistema) con persistencia de preferencias
 * 
 * 4. **Standalone Component**: Utiliza el patrón de componentes standalone
 *    de Angular 17+ para mayor modularidad y tree-shaking
 * 
 * ARQUITECTURA TÉCNICA:
 * - Patrón Standalone: No requiere NgModule, importa dependencias directamente
 * - Inyección de Dependencias: ThemeService y ActionSheetController
 * - Reactive Programming: Suscripción a observables para cambios de tema
 * - CUSTOM_ELEMENTS_SCHEMA: Permite el uso de web components de Ionic
 * 
 * @author Kleyver App Team
 * @version 1.0.0
 */

import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { 
  IonApp, 
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon, 
  IonLabel,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  personOutline, 
  mailOutline,
  sunnyOutline,
  moonOutline,
  heart,
  heartOutline,
  imagesOutline,
  location,
  locationOutline,
  cameraOutline,
  businessOutline,
  checkmarkCircleOutline,
  arrowForwardOutline,
  callOutline,
  logoInstagram,
  logoFacebook,
  logoTwitter,
  logoYoutube,
  close
} from 'ionicons/icons';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { Theme } from './services/theme.service';

/**
 * COMPONENTE RAÍZ DE LA APLICACIÓN KLEYVER APP
 * ============================================
 * 
 * Este componente define la estructura principal de la aplicación con:
 * - Sistema de navegación por tabs
 * - Gestión global de temas
 * - Configuración de iconos de la aplicación
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite el uso de web components de Ionic
  imports: [
    CommonModule,
    IonApp, 
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon, 
    IonLabel,
    RouterLink, 
    RouterLinkActive
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * CONFIGURACIÓN DE PÁGINAS PRINCIPALES
   * ===================================
   * 
   * Define la estructura de navegación de la aplicación.
   * Cada página tiene un título, URL de ruta y icono asociado.
   * 
   * Esta configuración se usa para generar dinámicamente
   * los tabs de navegación en el template.
   */
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Sobre Mí', url: '/informacion-personal', icon: 'person' },
    { title: 'Contacto', url: '/contacto', icon: 'mail' },
  ];
  
  /**
   * TEMA SELECCIONADO ACTUALMENTE
   * ============================
   * 
   * Almacena el tema actual de la aplicación:
   * - 'light': Tema claro
   * - 'dark': Tema oscuro
   * 
   * Se sincroniza automáticamente con el ThemeService.
   */
  public selectedTheme: Theme = 'light';
  private themeSubscription: Subscription = new Subscription();
  
  /**
   * CONSTRUCTOR - INICIALIZACIÓN DE LA APLICACIÓN
   * =============================================
   * 
   * Realiza la configuración inicial crítica:
   * 
   * 1. **Inyección de Dependencias**: 
   *    - ThemeService: Para gestión de temas
   *    - ActionSheetController: Para modales de selección de tema
   *    - Router: Para navegación y depuración
   * 
   * 2. **Registro de Iconos**: Configura todos los iconos de Ionicons
   *    que serán utilizados en la aplicación. Esto es necesario para
   *    el tree-shaking y optimización del bundle.
   * 
   * 3. **Suscripción a Temas**: Establece una suscripción reactiva
   *    al observable de temas para mantener sincronizado el estado
   *    local con el servicio global.
   * 
   * @param themeService - Servicio para gestión de temas
   * @param actionSheetCtrl - Controlador para mostrar action sheets
   * @param router - Servicio de Router para navegación
   */
  constructor(
    private themeService: ThemeService,
    private actionSheetCtrl: ActionSheetController,
    public router: Router
  ) {
    // Registro de todos los iconos utilizados en la aplicación
    addIcons({
      'home-outline': homeOutline,
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'sunny-outline': sunnyOutline,
      'moon-outline': moonOutline,
      'heart': heart,
      'heart-outline': heartOutline,
      'images-outline': imagesOutline,
      'location': location,
      'location-outline': locationOutline,
      'camera-outline': cameraOutline,
      'business-outline': businessOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'call-outline': callOutline,
      'logo-instagram': logoInstagram,
      'logo-facebook': logoFacebook,
      'logo-twitter': logoTwitter,
      'logo-youtube': logoYoutube,
      'close': close
    });
  }

  /**
   * INICIALIZACIÓN DEL COMPONENTE
   * =============================
   * 
   * Configura las suscripciones a eventos y estado inicial:
   * - Suscripción al servicio de temas para sincronizar el tema
   *   actual con toda la aplicación.
   */
  ngOnInit() {
    // Suscripción al tema actual
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.selectedTheme = theme;
    });
  }

  /**
   * LIMPIEZA AL DESTRUIR COMPONENTE
   * ==============================
   * 
   * Cancela todas las suscripciones para evitar memory leaks:
   * - Cancela la suscripción al servicio de temas
   */
  ngOnDestroy() {
    // Evitar memory leaks al destruir el componente
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  /**
   * CAMBIO CÍCLICO DE TEMA
   * ======================
   * 
   * Permite al usuario cambiar entre los dos temas disponibles
   * de manera cíclica con un solo botón:
   * light -> dark -> light...
   */
  cycleTheme() {
    let nextTheme: Theme;
    
    switch (this.selectedTheme) {
      case 'light':
        nextTheme = 'dark';
        break;
      case 'dark':
        nextTheme = 'light';
        break;
      default:
        nextTheme = 'light';
    }
    
    this.themeService.setTheme(nextTheme);
  }

  /**
   * OBTENER ICONO DE TEMA
   * ====================
   * 
   * Retorna el nombre del icono correspondiente al tema actual:
   * - 'light': Icono de sol (sunny-outline)
   * - 'dark': Icono de luna (moon-outline)
   * 
   * @returns Nombre del icono para el tema actual
   */
  getThemeIcon(): string {
    switch (this.selectedTheme) {
      case 'light':
        return 'sunny-outline';
      case 'dark':
        return 'moon-outline';
      default:
        return 'sunny-outline';
    }
  }

  /**
   * SELECCIÓN DE TEMA VÍA ACTION SHEET
   * =================================
   * 
   * Muestra un modal con las opciones de tema disponibles.
   * Permite al usuario elegir explícitamente entre:
   * - Tema Claro
   * - Tema Oscuro
   */
  async presentThemeActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar Tema',
      buttons: [
        {
          text: 'Claro',
          icon: 'sunny-outline',
          handler: () => {
            this.themeService.setTheme('light');
          }
        },
        {
          text: 'Oscuro',
          icon: 'moon-outline',
          handler: () => {
            this.themeService.setTheme('dark');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }
}