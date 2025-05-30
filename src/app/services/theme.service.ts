import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Tipos de tema disponibles en la aplicación
 * - light: Tema claro
 * - dark: Tema oscuro
 */
export type Theme = 'light' | 'dark';

/**
 * Servicio para gestionar los temas de la aplicación
 * 
 * Características:
 * - Soporte para temas claro y oscuro
 * - Persistencia de preferencias en localStorage
 * - Cambios reactivos que notifican a todos los componentes
 * - Aplicación dinámica de clases CSS al body
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  /**
   * BehaviorSubject para el tema actual
   * 
   * Permite que los componentes se suscriban a cambios de tema
   * y reciban el valor actual inmediatamente al suscribirse
   */
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  theme$ = this.themeSubject.asObservable();
  
  /**
   * Observable que indica si el tema oscuro está activo
   * Emite true cuando el tema es oscuro, false cuando es claro
   */
  darkMode: Observable<boolean> = this.theme$.pipe(
    map(theme => theme === 'dark')
  );

  private renderer: Renderer2;
  private currentTheme: Theme;

  constructor(rendererFactory: RendererFactory2) {
    // Crear renderer para manipular DOM de forma segura
    this.renderer = rendererFactory.createRenderer(null, null);
    this.currentTheme = this.getInitialTheme();
    this.applyTheme(this.currentTheme);
  }

  /**
   * Obtiene el tema inicial basado en preferencias guardadas o sistema
   * 
   * Prioridad:
   * 1. Tema guardado en localStorage (preferencia del usuario)
   * 2. Tema claro como default
   * 
   * @returns Theme - El tema inicial a aplicar
   */
  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    return 'light'; // Default: tema claro
  }

  /**
   * Cambia el tema de la aplicación
   * 
   * Proceso:
   * 1. Actualiza el tema actual en memoria
   * 2. Persiste la preferencia en localStorage
   * 3. Notifica a todos los suscriptores del cambio
   * 4. Aplica el tema al DOM
   * 
   * @param theme - Nuevo tema a aplicar
   */
  setTheme(theme: Theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  /**
   * Obtiene el tema actualmente activo
   * 
   * @returns Theme - El tema actual
   */
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Aplica el tema seleccionado manipulando las clases CSS del body
   * 
   * Funcionamiento:
   * - Remueve todas las clases de tema previas para evitar conflictos
   * - Aplica la clase correspondiente al tema seleccionado
   * 
   * Las clases CSS deben estar definidas en global.scss:
   * - .dark-theme: Variables CSS para tema oscuro
   * - .light-theme: Variables CSS para tema claro
   * 
   * @param theme - Tema a aplicar
   */
  private applyTheme(theme: Theme) {
    const body = document.body;

    // Limpiar clases de temas anteriores
    body.classList.remove('dark-theme', 'light-theme');

    switch (theme) {
      case 'dark':
        // Aplica el tema oscuro
        body.classList.add('dark-theme');
        break;
      case 'light':
        // Aplica el tema claro
        body.classList.add('light-theme');
        break;
    }
  }
  
  /**
   * Alterna entre modo claro y oscuro
   */
  toggleDarkMode() {
    const currentTheme = this.getCurrentTheme();
    
    if (currentTheme === 'dark') {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }
}
