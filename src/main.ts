/**
 * PUNTO DE ENTRADA PRINCIPAL DE LA APLICACIÓN KLEYVER APP
 * =======================================================
 * 
 * Este archivo configura e inicializa la aplicación Angular con Ionic
 * utilizando el nuevo sistema de bootstrapping standalone de Angular 17+.
 * 
 * CARACTERÍSTICAS TÉCNICAS:
 * - **Standalone Bootstrap**: No requiere NgModule, configuración directa
 * - **Ionic Integration**: Configuración optimizada para aplicaciones móviles
 * - **Router Strategy**: Estrategia de routing específica para Ionic
 * - **Preloading**: Carga anticipada de módulos para mejor rendimiento
 * 
 * BENEFICIOS DEL STANDALONE APPROACH:
 * - Bundle más pequeño (tree-shaking mejorado)
 * - Configuración más explícita y comprensible
 * - Mejor soporte para micro-frontends
 * - Alineado con las mejores prácticas modernas de Angular
 * 
 * OPTIMIZACIONES DE RENDIMIENTO:
 * - PreloadAllModules: Carga módulos en background después del inicial
 * - IonicRouteStrategy: Optimizada para navegación móvil
 * - Lazy loading automático configurado en routes
 * 
 * @author Kleyver App Team
 * @version 1.0.0
 */

// filepath: /Users/marg/Documents/ionic/kleyver-app/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
// Import the AppComponent directly
import { AppComponent } from './app/app.component';

/**
 * BOOTSTRAP DE LA APLICACIÓN
 * ==========================
 * 
 * Inicializa la aplicación Angular con configuración optimizada para Ionic.
 * 
 * CONFIGURACIÓN DE PROVIDERS:
 * 
 * 1. **RouteReuseStrategy**: 
 *    - IonicRouteStrategy optimiza la navegación para aplicaciones móviles
 *    - Maneja la reutilización de componentes de forma eficiente
 *    - Mejora la experiencia de navegación con animaciones nativas
 * 
 * 2. **provideIonicAngular()**: 
 *    - Configura todos los servicios y componentes de Ionic
 *    - Establece la configuración por defecto para el framework
 *    - Habilita funcionalidades específicas de dispositivos móviles
 * 
 * 3. **provideRouter()**: 
 *    - Configura el sistema de routing con las rutas definidas
 *    - withPreloading(PreloadAllModules): Carga módulos en background
 *    - Mejora el rendimiento al anticipar navegaciones del usuario
 * 
 * ESTRATEGIA DE PRELOADING:
 * - PreloadAllModules carga todas las rutas lazy después del bootstrap inicial
 * - Equilibrio entre tiempo de carga inicial y experiencia posterior
 * - Ideal para aplicaciones pequeñas a medianas como esta
 */
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
