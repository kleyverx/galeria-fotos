/**
 * CONFIGURACIÓN DE CAPACITOR PARA KLEYVER APP
 * ===========================================
 * 
 * Capacitor es el bridge nativo que permite que la aplicación web de Ionic
 * se ejecute como una aplicación nativa en iOS y Android.
 * 
 * CONFIGURACIÓN ACTUAL:
 * - **appId**: Identificador único de la aplicación en las tiendas
 * - **appName**: Nombre de la aplicación que aparece en el dispositivo
 * - **webDir**: Directorio donde se genera el build para producción
 * 
 * CAPACIDADES HABILITADAS POR CAPACITOR:
 * - Acceso a APIs nativas del dispositivo
 * - Empaquetado como aplicación nativa
 * - Distribución en App Store y Google Play
 * - Funcionamiento offline
 * - Integración con plugins nativos
 * 
 * NOTAS DE CONFIGURACIÓN:
 * - appId debería cambiarse para producción (ej: com.kleyver.photos)
 * - webDir 'www' es el estándar para proyectos Ionic
 * - Configuración mínima para desarrollo, expandible para producción
 * 
 * @see https://capacitorjs.com/docs/config
 * @author Kleyver App Team
 * @version 1.0.0
 */

// filepath: /Users/marg/Documents/ionic/kleyver-app/capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

/**
 * CONFIGURACIÓN PRINCIPAL DE CAPACITOR
 * ====================================
 * 
 * Configuración básica para el empaquetado y distribución de la aplicación.
 */
const config: CapacitorConfig = {
  /**
   * IDENTIFICADOR DE LA APLICACIÓN
   * ==============================
   * 
   * ID único que identifica la aplicación en las tiendas de aplicaciones.
   * 
   * IMPORTANTE: Para producción, cambiar a un dominio propio
   * Ejemplo: 'com.kleyver.photos' o 'com.tudominio.kleyverapp'
   * 
   * Este ID debe ser único y seguir el formato de reverse domain notation.
   */
  appId: 'io.ionic.starter',
  
  /**
   * NOMBRE DE LA APLICACIÓN
   * =======================
   * 
   * Nombre que aparecerá en el dispositivo del usuario.
   * Se muestra en:
   * - Lista de aplicaciones
   * - Configuración del dispositivo
   * - Tiendas de aplicaciones (si no se especifica otro)
   */
  appName: 'kleyver-app',
  
  /**
   * DIRECTORIO WEB
   * ==============
   * 
   * Carpeta donde Ionic/Angular genera los archivos de producción.
   * 
   * 'www' es el estándar para proyectos Ionic y se genera automáticamente
   * cuando se ejecuta 'ionic build' o 'ng build'.
   * 
   * Capacitor empaqueta todo el contenido de esta carpeta en la aplicación nativa.
   */
  webDir: 'www'
};

export default config;
