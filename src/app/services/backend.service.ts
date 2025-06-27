import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, retry } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Servicio HTTP para comunicación con el backend
 * 
 * Este servicio maneja todas las comunicaciones con el servidor backend,
 * incluyendo el envío del formulario de contacto.
 * 
 * Características:
 * - Manejo de errores HTTP
 * - Timeout de peticiones
 * - Retry automático en fallos de red
 * - Headers apropiados para CORS
 * - Tipado TypeScript
 */

export interface ContactFormData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  suscripcion: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  messageId?: string;
  errors?: any[];
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  
  // URL base del backend - cambiar según entorno
  private readonly API_BASE_URL = 'http://localhost:3000/api';
  
  // Configuración de timeouts
  private readonly REQUEST_TIMEOUT = 30000; // 30 segundos
  private readonly RETRY_ATTEMPTS = 2;

  constructor(private http: HttpClient) {}

  /**
   * Headers por defecto para las peticiones
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  /**
   * Envía el formulario de contacto al backend
   * 
   * @param formData - Datos del formulario
   * @returns Observable con la respuesta del servidor
   */
  enviarFormularioContacto(formData: ContactFormData): Observable<ApiResponse> {
    const url = `${this.API_BASE_URL}/contact`;
    
    return this.http.post<ApiResponse>(url, formData, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.REQUEST_TIMEOUT),
      retry(this.RETRY_ATTEMPTS), // Reintentar en caso de error de red
      map(response => {
        console.log('✅ Respuesta exitosa del backend:', response);
        return response;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Verifica el estado del servidor backend
   * 
   * @returns Observable con el estado del servidor
   */
  verificarEstadoServidor(): Observable<HealthCheckResponse> {
    const url = `${this.API_BASE_URL}/health`;
    
    return this.http.get<HealthCheckResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      timeout(10000), // Timeout más corto para health check
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Maneja los errores HTTP de manera consistente
   * 
   * @param error - Error HTTP
   * @returns Observable con el error formateado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorMessage = `Error de conexión: ${error.error.message}`;
      errorCode = 'NETWORK_ERROR';
      console.error('🌐 Error de red:', error.error.message);
      
    } else {
      // Error del lado del servidor
      console.error('🔴 Error del servidor:', {
        status: error.status,
        statusText: error.statusText,
        body: error.error
      });

      switch (error.status) {
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
          errorCode = 'CONNECTION_FAILED';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos del formulario inválidos';
          errorCode = 'VALIDATION_ERROR';
          break;
        case 429:
          errorMessage = error.error?.message || 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
          errorCode = 'RATE_LIMIT_EXCEEDED';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Inténtalo de nuevo más tarde.';
          errorCode = 'SERVER_ERROR';
          break;
        case 503:
          errorMessage = 'Servicio no disponible temporalmente';
          errorCode = 'SERVICE_UNAVAILABLE';
          break;
        default:
          errorMessage = `Error del servidor (${error.status}): ${error.statusText}`;
          errorCode = `HTTP_${error.status}`;
      }
    }

    // Retornar error consistente
    return throwError(() => ({
      success: false,
      message: errorMessage,
      code: errorCode,
      originalError: error
    }));
  }

  /**
   * Verifica si el backend está disponible
   * 
   * @returns Promise<boolean>
   */
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.verificarEstadoServidor().toPromise();
      return true;
    } catch (error) {
      console.warn('⚠️ Backend no disponible:', error);
      return false;
    }
  }

  /**
   * Obtiene la URL base de la API
   * 
   * @returns URL base configurada
   */
  getApiBaseUrl(): string {
    return this.API_BASE_URL;
  }
}
