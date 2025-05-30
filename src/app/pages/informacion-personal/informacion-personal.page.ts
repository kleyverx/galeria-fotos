import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonBadge
} from '@ionic/angular/standalone';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { SlideInLeftDirective } from '../../directives/slide-in-left.directive';
import { SlideInRightDirective } from '../../directives/slide-in-right.directive';
import { addIcons } from 'ionicons';
import { location } from 'ionicons/icons';

/**
 * Página de información personal - Perfil del fotógrafo
 * 
 * Esta página presenta información detallada sobre el fotógrafo/autor
 * de la aplicación, incluyendo:
 * 
 * Contenido mostrado:
 * - Biografía personal con foto de perfil
 * - Lista de destinos favoritos visitados
 * - Equipo fotográfico categorizado (cámaras, lentes, accesorios)
 * - Línea de tiempo de experiencia profesional
 * - Información de contacto y redes sociales
 * 
 * Características técnicas:
 * - Diseño responsive con cards y listas de Ionic
 * - Animaciones de entrada escalonadas para elementos
 * - Badges para categorizar el equipo fotográfico
 * - Iconos de ubicación para destinos
 * - Layout optimizado para lectura cómoda
 * 
 * UX/UI:
 * - Estructura jerárquica clara de información
 * - Uso de colores y badges para organización visual
 * - Animaciones sutiles que mejoran la percepción de calidad
 * - Contenido estático optimizado para carga rápida
 */
@Component({
  selector: 'app-informacion-personal',
  templateUrl: './informacion-personal.page.html',
  styleUrls: ['./informacion-personal.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonBadge,
    FadeInDirective,
    SlideInLeftDirective,
    SlideInRightDirective
  ]
})
export class InformacionPersonalPage implements OnInit {

  constructor() { 
    /**
     * Registro de iconos mínimo para esta página
     * 
     * Solo se registra el icono de ubicación que se usa
     * para marcar los destinos favoritos en la lista
     */
    addIcons({
      'location': location
    });
  }

  ngOnInit() {
    /**
     * Página con contenido estático
     * 
     * No requiere inicialización de datos dinámicos
     * ya que toda la información se renderiza directamente
     * en el template con datos hardcodeados
     * 
     * En una versión más avanzada, aquí se podrían cargar
     * datos desde un CMS o API de perfil de usuario
     */
  }

}
