/**
 * CONFIGURACIÓN DE RUTAS DE LA APLICACIÓN KLEYVER APP
 * ===================================================
 * 
 * Define el sistema de navegación y lazy loading de la aplicación.
 * Utiliza el nuevo sistema de routing de Angular con componentes standalone.
 * 
 * CARACTERÍSTICAS TÉCNICAS:
 * - **Lazy Loading**: Cada página se carga bajo demanda para optimizar el bundle inicial
 * - **Redirects**: Manejo de rutas legacy y ruta raíz
 * - **Standalone Components**: Compatible con el nuevo sistema de Angular 17+
 * - **Code Splitting**: Cada página genera un chunk separado para mejor caching
 * 
 * BENEFICIOS DEL LAZY LOADING:
 * - Tiempo de carga inicial más rápido
 * - Mejor experiencia en conexiones lentas  
 * - Chunks más pequeños = mejor caching
 * - Escalabilidad para aplicaciones grandes
 * 
 * ESTRUCTURA DE NAVEGACIÓN:
 * - /inicio: Página principal con galería de fotos
 * - /informacion-personal: Perfil del fotógrafo
 * - /contacto: Formulario de contacto
 * 
 * @author Kleyver App Team
 * @version 1.0.0
 */

// filepath: /Users/marg/Documents/ionic/kleyver-app/src/app/app.routes.ts
import { Routes } from '@angular/router';

/**
 * CONFIGURACIÓN DE RUTAS DE LA APLICACIÓN
 * =======================================
 * 
 * Sistema de routing con lazy loading para optimizar el rendimiento.
 * Cada ruta carga su componente bajo demanda usando dynamic imports.
 */
export const routes: Routes = [
  /**
   * REDIRECT DE RUTA LEGACY
   * =======================
   * 
   * Redirige la ruta '/home' hacia '/inicio' para mantener
   * compatibilidad con versiones anteriores o enlaces externos.
   * 
   * pathMatch: 'full' asegura que solo redirija cuando la ruta
   * coincida exactamente con '/home'.
   */
  {
    path: 'home',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  
  /**
   * REDIRECT DE RUTA RAÍZ
   * =====================
   * 
   * Redirige la ruta vacía ('/') hacia '/inicio' como página por defecto.
   * Esto define cuál es la landing page de la aplicación.
   * 
   * pathMatch: 'full' es crítico aquí para evitar que interfiera
   * con otras rutas que comiencen con cadena vacía.
   */
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  
  /**
   * PÁGINA PRINCIPAL - INICIO
   * =========================
   * 
   * Lazy loading del componente HomePage que contiene:
   * - Galería de fotos con sistema de favoritos
   * - Animaciones de entrada escalonadas
   * - Integración con FotosService y AnimationService
   * 
   * loadComponent: Función que retorna un Promise del componente,
   * permitiendo code splitting automático.
   */
  {
    path: 'inicio',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  
  /**
   * PÁGINA DE INFORMACIÓN PERSONAL
   * ==============================
   * 
   * Lazy loading del perfil del fotógrafo que incluye:
   * - Información personal y profesional
   * - Contenido estático optimizado
   * - Diseño responsivo para diferentes dispositivos
   */
  {
    path: 'informacion-personal',
    loadComponent: () => import('./pages/informacion-personal/informacion-personal.page').then( m => m.InformacionPersonalPage)
  },
  
  /**
   * PÁGINA DE CONTACTO
   * ==================
   * 
   * Lazy loading del formulario de contacto que contiene:
   * - Formulario reactivo con validaciones
   * - Feedback visual en tiempo real
   * - Integración con servicios de envío (simulado)
   */
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto.page').then( m => m.ContactoPage)
  },
];
