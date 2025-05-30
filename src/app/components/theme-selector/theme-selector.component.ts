import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';
import { ThemeService, Theme } from '../../services/theme.service';
import { addIcons } from 'ionicons';
import { sunnyOutline, moonOutline } from 'ionicons/icons';

@Component({
  selector: 'app-theme-selector',
  template: `
    <ion-segment [(ngModel)]="selectedTheme" (ionChange)="themeChanged()" mode="ios" class="theme-selector">
      <ion-segment-button value="light">
        <ion-icon name="sunny-outline"></ion-icon>
        <ion-label>Claro</ion-label>
      </ion-segment-button>
      <ion-segment-button value="dark">
        <ion-icon name="moon-outline"></ion-icon>
        <ion-label>Oscuro</ion-label>
      </ion-segment-button>
    </ion-segment>
  `,
  styles: [`
    .theme-selector {
      margin: 10px auto;
      max-width: 300px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon
  ]
})
export class ThemeSelectorComponent implements OnInit {
  selectedTheme: Theme = 'light';

  constructor(private themeService: ThemeService) {
    addIcons({
      'sunny-outline': sunnyOutline,
      'moon-outline': moonOutline
    });
  }

  ngOnInit() {
    // Obtener el tema actual al iniciar el componente
    this.themeService.theme$.subscribe(theme => {
      this.selectedTheme = theme;
    });
  }

  themeChanged() {
    this.themeService.setTheme(this.selectedTheme);
  }
}
