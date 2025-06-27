import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { BackendService } from './backend.service';

/**
 * Servicio para envío de emails con múltiples opciones
 * 
 * Este servicio soporta diferentes métodos de envío:
 * 1. EmailJS (frontend directo)
 * 2. Backend propio con Node.js
 * 3. Fallback automático entre métodos
 * 
 * Configuración:
 * - Prioriza backend si está disponible
 * - Fallback a EmailJS si backend falla
 * - Manejo de errores robusto
 */
@Injectable({
  providedIn: 'root'
})
export class EmailService {
  
  // Configuración de EmailJS (reemplazar con tus datos reales)
  private readonly EMAIL_CONFIG = {
    SERVICE_ID: 'service_tu_servicio',      // ID del servicio de email
    TEMPLATE_ID: 'template_contacto',        // ID de la plantilla
    PUBLIC_KEY: 'tu_clave_publica'           // Clave pública de EmailJS
  };

  // Modo de envío preferido
  private readonly PREFER_BACKEND = true;

  constructor(private backendService: BackendService) {
    // Inicializar EmailJS con la clave pública
    emailjs.init(this.EMAIL_CONFIG.PUBLIC_KEY);
  }

  /**
   * Envía un email de contacto usando el mejor método disponible
   * 
   * Orden de prioridad:
   * 1. Backend propio (si está disponible)
   * 2. EmailJS (fallback)
   * 
   * @param formData - Datos del formulario de contacto
   * @returns Promise con el resultado del envío
   */
  async enviarEmailContacto(formData: any): Promise<any> {
    console.log('📧 Iniciando envío de email con datos:', formData);

    // Opción 1: Intentar con backend propio
    if (this.PREFER_BACKEND) {
      try {
        console.log('🔄 Intentando envío por backend...');
        const backendResult = await this.enviarPorBackend(formData);
        
        if (backendResult.success) {
          console.log('✅ Email enviado exitosamente por backend');
          return backendResult;
        }
        
        console.warn('⚠️ Backend falló, intentando con EmailJS...');
        
      } catch (error) {
        console.warn('⚠️ Error en backend, fallback a EmailJS:', error);
      }
    }

    // Opción 2: Fallback a EmailJS
    return this.enviarPorEmailJS(formData);
  }

  /**
   * Envía email usando el backend propio
   * 
   * @param formData - Datos del formulario
   * @returns Promise con resultado
   */
  private async enviarPorBackend(formData: any): Promise<any> {
    try {
      const result = await this.backendService.enviarFormularioContacto(formData).toPromise();
      
      return {
        success: true,
        message: 'Email enviado correctamente por servidor backend',
        method: 'backend',
        data: result
      };
      
    } catch (error: any) {
      console.error('❌ Error en backend:', error);
      
      return {
        success: false,
        message: error.message || 'Error en servidor backend',
        method: 'backend',
        error: error
      };
    }
  }

  /**
   * Envía email usando EmailJS
   * 
   * @param formData - Datos del formulario
   * @returns Promise con resultado
   */
  private async enviarPorEmailJS(formData: any): Promise<any> {
    if (!this.isEmailJSConfigured()) {
      return {
        success: false,
        message: 'EmailJS no está configurado correctamente',
        method: 'emailjs'
      };
    }

    try {
      console.log('🔄 Enviando por EmailJS...');
      
      // Preparar los datos para la plantilla de email
      const templateParams = {
        from_name: formData.nombre,
        from_email: formData.email,
        subject: this.getAsuntoTexto(formData.asunto),
        message: formData.mensaje,
        to_name: 'Kleyver Urbina',
        reply_to: formData.email,
        suscripcion: formData.suscripcion ? 'Sí' : 'No',
        fecha: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Enviar el email usando EmailJS
      const response = await emailjs.send(
        this.EMAIL_CONFIG.SERVICE_ID,
        this.EMAIL_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Email enviado exitosamente por EmailJS:', response);
      
      return {
        success: true,
        message: 'Email enviado correctamente por EmailJS',
        method: 'emailjs',
        data: response
      };

    } catch (error) {
      console.error('❌ Error al enviar email por EmailJS:', error);
      
      return {
        success: false,
        message: 'Error al enviar el email. Inténtalo de nuevo.',
        method: 'emailjs',
        error: error
      };
    }
  }

  /**
   * Convierte el código del asunto a texto legible
   * 
   * @param asunto - Código del asunto seleccionado
   * @returns Texto descriptivo del asunto
   */
  private getAsuntoTexto(asunto: string): string {
    const asuntos: { [key: string]: string } = {
      'info': 'Información sobre destinos',
      'collab': 'Propuesta de colaboración',
      'feedback': 'Comentarios sobre fotografías',
      'other': 'Consulta general'
    };
    
    return asuntos[asunto] || 'Consulta general';
  }

  /**
   * Valida la configuración de EmailJS
   * 
   * @returns true si la configuración es válida
   */
  private isEmailJSConfigured(): boolean {
    return this.EMAIL_CONFIG.SERVICE_ID !== 'service_tu_servicio' &&
           this.EMAIL_CONFIG.TEMPLATE_ID !== 'template_contacto' &&
           this.EMAIL_CONFIG.PUBLIC_KEY !== 'tu_clave_publica';
  }

  /**
   * Valida si algún método de envío está configurado
   * 
   * @returns true si hay al menos un método disponible
   */
  isConfigured(): boolean {
    return this.isEmailJSConfigured() || this.PREFER_BACKEND;
  }

  /**
   * Envía un email de confirmación al usuario (usando EmailJS)
   * 
   * @param userData - Datos del usuario
   * @returns Promise con el resultado
   */
  async enviarConfirmacionUsuario(userData: any): Promise<any> {
    if (!this.isEmailJSConfigured()) {
      return {
        success: false,
        message: 'EmailJS no configurado para confirmaciones'
      };
    }

    try {
      const templateParams = {
        to_name: userData.nombre,
        to_email: userData.email,
        from_name: 'Kleyver Urbina',
        message: `Hola ${userData.nombre},\n\nGracias por contactarme. He recibido tu mensaje y te responderé pronto.\n\n¡Saludos!`
      };

      // Usar una plantilla diferente para confirmaciones
      const response = await emailjs.send(
        this.EMAIL_CONFIG.SERVICE_ID,
        'template_confirmacion', // Plantilla de confirmación
        templateParams
      );

      return {
        success: true,
        message: 'Confirmación enviada al usuario',
        data: response
      };

    } catch (error) {
      console.warn('⚠️ No se pudo enviar confirmación al usuario:', error);
      return {
        success: false,
        message: 'No se pudo enviar la confirmación',
        error: error
      };
    }
  }

  /**
   * Obtiene información de estado de los servicios
   * 
   * @returns Estado de los servicios de email
   */
  async getServicesStatus(): Promise<any> {
    const status = {
      emailjs: {
        configured: this.isEmailJSConfigured(),
        available: this.isEmailJSConfigured()
      },
      backend: {
        configured: this.PREFER_BACKEND,
        available: false
      }
    };

    // Verificar disponibilidad del backend
    try {
      status.backend.available = await this.backendService.isBackendAvailable();
    } catch (error) {
      status.backend.available = false;
    }

    return status;
  }
}
