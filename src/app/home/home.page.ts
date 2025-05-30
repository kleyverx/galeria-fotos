// filepath: /Users/marg/Documents/ionic/kleyver-app/src/app/home/home.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Importar servicios
import { FotosService, Foto } from '../services/fotos.service';
import { ThemeService } from '../services/theme.service';

// Importar directivas de animación
import { FadeInDirective } from '../directives/fade-in.directive';
import { SlideInLeftDirective } from '../directives/slide-in-left.directive';
import { SlideInRightDirective } from '../directives/slide-in-right.directive';
import { PulseDirective } from '../directives/pulse.directive';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    FadeInDirective,
    SlideInLeftDirective,
    SlideInRightDirective,
    PulseDirective
  ],
})
export class HomePage implements OnInit, OnDestroy {
  // Propiedades para la interfaz
  themeIcon = 'moon-outline';
  private themeSubscription: Subscription | undefined;
  private fotosSubscription: Subscription | undefined;
  
  // Datos desde el servicio
  fotos: Foto[] = [];
  
  // Estadísticas
  stats = {
    photos: 0,
    destinations: 0,
    favorites: 0
  };

  categories = [
    {
      icon: 'camera-outline',
      title: 'Paisajes',
      description: 'Vistas impresionantes de la naturaleza',
      count: 0
    },
    {
      icon: 'business-outline',
      title: 'Arquitectura',
      description: 'Construcciones fascinantes',
      count: 0
    },
    {
      icon: 'heart-outline',
      title: 'Favoritos',
      description: 'Tu selección personal',
      count: 0
    }
  ];

  features = [
    {
      icon: 'camera-outline',
      title: 'Fotografía de Viajes',
      description: 'Capturo la esencia de cada destino, desde paisajes majestuosos hasta detalles únicos que hacen especial cada lugar.'
    },
    {
      icon: 'checkmark-circle-outline',
      title: 'Calidad Premium',
      description: 'Cada imagen está cuidadosamente seleccionada y procesada para ofrecer la mejor calidad visual y experiencia.'
    },
    {
      icon: 'heart-outline',
      title: 'Momentos Únicos',
      description: 'Documento experiencias auténticas y momentos irrepetibles que cuentan historias y despiertan emociones.'
    }
  ];

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private fotosService: FotosService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    // Suscribirse al servicio de tema
    this.themeSubscription = this.themeService.darkMode.subscribe(isDark => {
      this.themeIcon = isDark ? 'sunny-outline' : 'moon-outline';
    });

    // Suscribirse al servicio de fotos - TODA LA GESTIÓN ES DEL SERVICIO
    this.fotosSubscription = this.fotosService.obtenerFotos().subscribe(fotos => {
      // Asignar directamente las fotos del servicio
      this.fotos = fotos;

      // Estadísticas dinámicas
      this.stats = {
        photos: fotos.length,
        destinations: new Set(fotos.map(f => f.ubicacion)).size,
        favorites: fotos.filter(f => f.favorito).length
      };

      // Conteo de categorías
      const conteos = this.fotosService.obtenerConteoCategoria();
      this.categories = [
        {
          icon: 'camera-outline',
          title: 'Paisajes',
          description: 'Vistas impresionantes de la naturaleza',
          count: conteos['paisajes'] || 0
        },
        {
          icon: 'business-outline',
          title: 'Arquitectura',
          description: 'Construcciones fascinantes',
          count: conteos['arquitectura'] || 0
        },
        {
          icon: 'heart-outline',
          title: 'Favoritos',
          description: 'Tu selección personal',
          count: fotos.filter(f => f.favorito).length
        }
      ];
    });
  }

  ngOnDestroy() {
    // Desuscribirse para evitar pérdidas de memoria
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.fotosSubscription) {
      this.fotosSubscription.unsubscribe();
    }
  }

  exploreCollection() {
    // Navegar a la página de colección completa
    console.log('Explorando colección...');
    // this.router.navigate(['/fotos']);
  }

  contactAction() {
    // Navegar a la página de contacto
    this.router.navigate(['/contacto']);
  }

  toggleTheme() {
    // Cambiar entre modo claro y oscuro
    this.themeService.toggleDarkMode();
  }
  
  navigateToCategory(category: any) {
    console.log('Navegando a categoría:', category.title);
    // this.router.navigate(['/categoria', category.title.toLowerCase()]);
  }

  async openPhotoModal(foto: Foto) {
    const { PhotoModalComponent } = await import('../components/photo-modal.component');
    
    const modal = await this.modalController.create({
      component: PhotoModalComponent,
      componentProps: {
        foto: foto
      },
      cssClass: 'fullscreen-photo-modal',
      showBackdrop: false,
      backdropDismiss: true
    });

    await modal.present();
  }
}
