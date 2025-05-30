import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Foto } from '../services/fotos.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-photo-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content [fullscreen]="true" class="photo-modal-content">
      <!-- Header con botón de cerrar -->
      <div class="photo-header">
        <ion-button 
          fill="clear" 
          color="danger"
          class="close-button"
          [class.dark-theme]="isDarkMode"
          [class.light-theme]="!isDarkMode"
          (click)="closeModal()"
          aria-label="Cerrar modal">
          <ion-icon name="close" slot="icon-only"></ion-icon>
        </ion-button>
      </div>

      <!-- Contenedor principal de la imagen -->
      <div class="image-container" (click)="closeModal()">
        <img 
          *ngIf="foto"
          [src]="foto.url" 
          [alt]="foto.titulo"
          class="modal-image"
          (load)="onImageLoad()"
          (error)="onImageError()"
          [class.loaded]="imageLoaded"
          (click)="$event.stopPropagation()"
          #modalImage>
        
        <!-- Loading spinner -->
        <div class="loading-container" *ngIf="!imageLoaded">
          <ion-spinner name="crescent" color="light"></ion-spinner>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .photo-modal-content {
      --background: rgba(0, 0, 0, 0.95);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .photo-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      padding: var(--ion-safe-area-top, 20px) 16px 16px;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
      transition: opacity 0.3s ease;
    }

    .photo-header.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .close-button {
      --border-radius: 50%;
      --padding-start: 8px;
      --padding-end: 8px;
      --padding-top: 8px;
      --padding-bottom: 8px;
      --color: #ff4757;
      width: 44px;
      height: 44px;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #ff4757;
      transition: all 0.3s ease;
    }

    /* Estilos para tema claro */
    .close-button.light-theme {
      background: rgba(255, 255, 255, 0.95);
      border: 2px solid #ff4757;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    /* Estilos para tema oscuro */
    .close-button.dark-theme {
      background: rgba(40, 40, 40, 0.95);
      border: 2px solid #ff6b7a;
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
    }

    .close-button.dark-theme ion-icon {
      color: #ff6b7a !important;
    }

    .close-button ion-icon {
      color: #ff4757 !important;
      font-size: 24px;
      font-weight: bold;
    }

    .close-button:hover {
      transform: scale(1.05);
    }

    .close-button.light-theme:hover {
      background: rgba(255, 71, 87, 0.1);
      --color: #ff3838;
    }

    .close-button.dark-theme:hover {
      background: rgba(255, 107, 122, 0.2);
      --color: #ff8a95;
    }

    .image-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      min-height: 100vh;
      cursor: pointer;
    }

    .modal-image {
      max-width: 100%;
      max-height: 100vh;
      object-fit: contain;
      opacity: 0;
      transition: opacity 0.3s ease;
      user-select: none;
    }

    .modal-image.loaded {
      opacity: 1;
    }

    .loading-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .close-button {
        width: 48px;
        height: 48px;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .photo-header {
        padding: 24px;
      }
      
      .modal-image {
        max-height: 90vh;
      }
    }

    @media (min-width: 1025px) {
      .photo-header {
        padding: 32px;
      }
      
      .modal-image {
        max-height: 85vh;
        max-width: 90vw;
      }
      
      .image-container {
        padding: 80px 32px;
      }
    }

    /* Animaciones de entrada */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .modal-image.loaded {
      animation: fadeIn 0.3s ease-out;
    }

    /* Mejoras para dispositivos táctiles */
    @media (hover: none) and (pointer: coarse) {
      .close-button {
        width: 48px;
        height: 48px;
        --color: #ff4757;
      }
      
      .close-button.light-theme {
        background: rgba(255, 255, 255, 0.98);
      }
      
      .close-button.dark-theme {
        background: rgba(40, 40, 40, 0.98);
        --color: #ff6b7a;
      }
      
      .close-button.dark-theme ion-icon {
        color: #ff6b7a !important;
      }
      
      .close-button ion-icon {
        font-size: 26px;
      }
    }
  `]
})
export class PhotoModalComponent implements OnInit, OnDestroy {
  @Input() foto?: Foto;
  
  imageLoaded = false;
  isDarkMode = false;
  private themeSubscription?: Subscription;

  constructor(
    private modalController: ModalController,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de tema
    this.themeSubscription = this.themeService.darkMode.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngOnDestroy() {
    // Limpiar suscripción
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onImageError() {
    console.error('Error al cargar la imagen');
    // Aquí puedes mostrar una imagen por defecto o un mensaje de error
  }
}
