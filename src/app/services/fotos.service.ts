/**
 * SERVICIO DE GESTIÓN DE CONTENIDO MULTIMEDIA - FOTOS 
 * =============================================================
 * 
 * Este servicio centraliza la gestión de contenido multimedia incluyendo
 * fotos para la aplicación Kleyver App.
 * 
 * CARACTERÍSTICAS EXPANDIDAS:
 * - Gestión de fotos (implementación existente)

 * - Sistema de favoritos para ambos tipos de contenido
 * - Filtrado reactivo con BehaviorSubject
 * 
 * @author Kleyver App Team
 * @version 2.0.0
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

/**
 * INTERFAZ PARA CONTENIDO MULTIMEDIA
 * ==================================
 * 
 * Define la estructura base para fotos y videos en la aplicación.
 */
export interface Foto {
  id: number;
  url: string;
  tipo: 'foto' | 'video';
  titulo: string;
  ubicacion: string;
  descripcion: string;
  fecha: string;
  favorito: boolean;
  categoria?: string; // Categoría del contenido: 'paisaje', 'arquitectura', etc.
  duracion?: number; // Duración en segundos (solo para videos)
  vistas?: number; // Número de vistas (principalmente para videos)
  reproduciendo?: boolean; // Estado de reproducción (solo para videos)
  size?: 'large' | 'medium' | 'wide' | 'tall'; // Tamaño para el layout visual
}

/**
 * SERVICIO DE GESTIÓN DE CONTENIDO MULTIMEDIA
 * ===========================================
 */
@Injectable({
  providedIn: 'root'
})
export class FotosService {
  /**
   * ARRAY DE CONTENIDO MULTIMEDIA
   */
  private _fotos: Foto[] = [
    
    
    // 🎨 GALERÍA REORGANIZADA - NUEVA DISTRIBUCIÓN VISUAL
    // ===================================================
    // Orden optimizado para crear un flow visual dinámico
    // con diferentes formas y tamaños que mantienen el equilibrio
    
    // 🌟 FOTO DESTACADA DE APERTURA - Grande y llamativa
    {
      id: 11,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      titulo: 'Bosque Encantado',
      ubicacion: 'Nueva Zelanda',
      descripcion: 'Sendero mágico entre árboles milenarios.',
      fecha: '2023-11-18',
      favorito: false,
      categoria: 'paisaje',
      size: 'large'
    },
    
    // 🏔️ MONTAÑAS - Formato vertical para mostrar altura
    {
      id: 2,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a',
      titulo: 'Montañas Nevadas',
      ubicacion: 'Alpes Suizos',
      descripcion: 'Vista panorámica de las majestuosas montañas cubiertas de nieve.',
      fecha: '2023-04-20',
      favorito: false,
      categoria: 'paisaje',
      size: 'tall'
    },
    
    // 🏛️ ARQUITECTURA - Formato medio para balance
    {
      id: 10,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b',
      titulo: 'Rascacielos Modernos',
      ubicacion: 'Tokio, Japón',
      descripcion: 'Skyline futurista de la ciudad moderna.',
      fecha: '2023-10-12',
      favorito: true,
      categoria: 'arquitectura',
      size: 'medium'
    },
    
    // 🌅 PANORÁMICA DE CIUDAD - Formato ancho
    {
      id: 3,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd',
      titulo: 'Atardecer en la Ciudad',
      ubicacion: 'París, Francia',
      descripcion: 'Espectacular atardecer con la Torre Eiffel en primer plano.',
      fecha: '2023-06-05',
      favorito: true,
      categoria: 'arquitectura',
      size: 'wide'
    },
    
    // 🏖️ PLAYA PARADISÍACA - Formato medio
    {
      id: 1,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439',
      titulo: 'Playa Paradisíaca',
      ubicacion: 'Bali, Indonesia',
      descripcion: 'Hermosa playa de aguas cristalinas y arena blanca.',
      fecha: '2023-05-15',
      favorito: true,
      categoria: 'paisaje',
      size: 'medium'
    },
    
    // 💧 CASCADA - Formato vertical para resaltar la caída
    {
      id: 4,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1534008897995-27a23e859048',
      titulo: 'Cascada Tropical',
      ubicacion: 'Costa Rica',
      descripcion: 'Impresionante cascada en medio de la selva tropical.',
      fecha: '2023-02-18',
      favorito: false,
      categoria: 'paisaje',
      size: 'tall'
    },
    
    // 🏺 MERCADO - Formato grande para mostrar detalles
    {
      id: 5,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce',
      titulo: 'Mercado Local',
      ubicacion: 'Marrakech, Marruecos',
      descripcion: 'Colorido mercado lleno de especias y artesanías locales.',
      fecha: '2023-01-30',
      favorito: true,
      categoria: 'personas',
      size: 'large'
    },
    
    // 🏛️ ARQUITECTURA CLÁSICA - Formato medio
    {
      id: 6,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad',
      titulo: 'Edificio Histórico',
      ubicacion: 'Roma, Italia',
      descripcion: 'Impresionante arquitectura clásica de la antigua Roma.',
      fecha: '2023-07-10',
      favorito: false,
      categoria: 'arquitectura',
      size: 'medium'
    },
    
    // 🛣️ CARRETERA - Formato ancho panorámico
    {
      id: 13,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      titulo: 'Carretera Panorámica',
      ubicacion: 'Route 66, USA',
      descripcion: 'Carretera legendaria atravesando paisajes únicos.',
      fecha: '2024-01-15',
      favorito: false,
      categoria: 'paisaje',
      size: 'wide'
    },
    
    // 🏔️ LAGO - Formato vertical para profundidad
    {
      id: 8,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
      titulo: 'Lago Sereno',
      ubicacion: 'Banff, Canadá',
      descripcion: 'Lago cristalino rodeado de montañas y bosques.',
      fecha: '2023-08-22',
      favorito: true,
      categoria: 'paisaje',
      size: 'tall'
    },
    
    // 🥘 GASTRONOMÍA - Formato medio compacto
    {
      id: 14,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3',
      titulo: 'Café Parisino',
      ubicacion: 'París, Francia',
      descripcion: 'Ambiente acogedor de un café tradicional francés.',
      fecha: '2024-02-08',
      favorito: true,
      categoria: 'gastronomia',
      size: 'medium'
    },
    
    // 🏜️ DESIERTO - Formato grande expansivo
    {
      id: 9,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      titulo: 'Desierto Infinito',
      ubicacion: 'Sahara, Marruecos',
      descripcion: 'Dunas doradas bajo el cielo azul del desierto.',
      fecha: '2023-09-05',
      favorito: false,
      categoria: 'paisaje',
      size: 'large'
    },
    
    // 🏯 TEMPLO - Formato ancho para mostrar contexto
    {
      id: 15,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1514473776127-61e2dc1dded3',
      titulo: 'Templo Sagrado',
      ubicacion: 'Kyoto, Japón',
      descripcion: 'Arquitectura tradicional japonesa en primavera.',
      fecha: '2024-03-12',
      favorito: false,
      categoria: 'arquitectura',
      size: 'wide'
    },
    
    // 🍜 COMIDA ASIÁTICA - Formato vertical para detalle
    {
      id: 12,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
      titulo: 'Gastronomía Local',
      ubicacion: 'Bangkok, Tailandia',
      descripcion: 'Deliciosos platos tradicionales tailandeses.',
      fecha: '2023-12-03',
      favorito: true,
      categoria: 'gastronomia',
      size: 'tall'
    },
    
    // 🌊 FIORDO - Formato medio equilibrado
    {
      id: 16,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd',
      titulo: 'Fiordo Espectacular',
      ubicacion: 'Noruega',
      descripcion: 'Majestuoso fiordo con aguas azules profundas.',
      fecha: '2024-04-05',
      favorito: true,
      categoria: 'paisaje',
      size: 'medium'
    },
    
    // 🏰 PLAZA HISTÓRICA - Formato ancho para contexto arquitectónico
    {
      id: 17,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1592916485147-1e38fc823d21?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      titulo: 'Plaza Histórica',
      ubicacion: 'Praga, República Checa',
      descripcion: 'Plaza medieval con arquitectura gótica impresionante.',
      fecha: '2024-04-20',
      favorito: false,
      categoria: 'arquitectura',
      size: 'wide'
    },
    
    // 🎭 FOTOS ADICIONALES PARA VARIEDAD VISUAL
    // ==========================================
    
    // 🌺 JARDÍN BOTÁNICO - Formato vertical para mostrar altura floral
    {
      id: 18,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
      titulo: 'Sendero en el Bosque',
      ubicacion: 'Selva Negra, Alemania',
      descripcion: 'Camino serpenteante entre árboles ancestrales.',
      fecha: '2024-05-10',
      favorito: true,
      categoria: 'paisaje',
      size: 'tall'
    },
    
    // 🏖️ COSTA DRAMÁTICA - Formato grande para impacto
    {
      id: 19,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      titulo: 'Costa Salvaje',
      ubicacion: 'Islas Lofoten, Noruega',
      descripcion: 'Acantilados dramáticos golpeados por el mar.',
      fecha: '2024-05-25',
      favorito: false,
      categoria: 'paisaje',
      size: 'large'
    },
    
    // 🎨 ARTE URBANO - Formato medio
    {
      id: 20,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1516417736013-1ecacb175519',
      titulo: 'Arte Callejero',
      ubicacion: 'Barrio Gótico, Barcelona',
      descripcion: 'Murales coloridos que narran historias urbanas.',
      fecha: '2024-06-08',
      favorito: true,
      categoria: 'arquitectura',
      size: 'medium'
    },
    
    // 🌾 CAMPO DE TRIGO - Formato ancho panorámico
    {
      id: 21,
      tipo: 'foto',
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
      titulo: 'Campos Dorados',
      ubicacion: 'Toscana, Italia',
      descripcion: 'Ondulantes campos de trigo bajo el sol de verano.',
      fecha: '2024-06-20',
      favorito: false,
      categoria: 'paisaje',
      size: 'wide'
    }
  ];

  /**
   * BehaviorSubject que emite la lista de fotos actual
   */
  private fotosSubject = new BehaviorSubject<Foto[]>(this._fotos);
  
  /**
   * Observable público para que los componentes se suscriban
   */
  fotos$ = this.fotosSubject.asObservable();

  constructor() { }

  /**
   * Retorna el Observable de fotos para suscripción en componentes
   */
  obtenerFotos() {
    return this.fotos$;
  }

  /**
   * Busca y retorna una foto específica por su ID
   */
  obtenerFotoPorId(id: number) {
    return this._fotos.find(foto => foto.id === id);
  }

  /**
   * Cambia el estado de favorito de una foto (toggle)
   */
  toggleFavorito(id: number) {
    this._fotos = this._fotos.map(foto => {
      if (foto.id === id) {
        // Crea nuevo objeto para mantener inmutabilidad
        return { ...foto, favorito: !foto.favorito };
      }
      return foto; // Retorna la foto sin cambios
    });
    
    // Emite el nuevo estado a todos los componentes suscritos
    this.fotosSubject.next(this._fotos);
  }

  /**
   * Filtra y retorna solo las fotos marcadas como favoritas
   */
  obtenerFavoritos() {
    return this._fotos.filter(foto => foto.favorito);
  }

  /**
   * Filtra y retorna fotos por categoría específica
   */
  obtenerPorCategoria(categoria: string) {
    return this._fotos.filter(foto => 
      foto.tipo === 'foto' && foto.categoria === categoria
    );
  }
  
  /**
   * Obtiene el conteo de fotos por categoría
   */
  obtenerConteoCategoria() {
    const conteo: { [key: string]: number } = {
      paisajes: 0,
      arquitectura: 0,
      personas: 0,
      gastronomia: 0
    };
    
    this._fotos.forEach(foto => {
      if (foto.tipo === 'foto') {
        if (foto.categoria === 'paisaje') conteo['paisajes']++;
        else if (foto.categoria === 'arquitectura') conteo['arquitectura']++;
        else if (foto.categoria === 'personas') conteo['personas']++;
        else if (foto.categoria === 'gastronomia') conteo['gastronomia']++;
      }
    });
    
    return conteo;
  }
  
  /**
   * Obtiene todas las fotos
   * @returns Observable con el array de fotos
   */
  getAll(): Observable<Foto[]> {
    return of(this._fotos);
  }

  /**
   * Obtiene fotos para la página principal (primeras 18)
   * @returns Array de fotos para mostrar en home
   */
  obtenerFotosParaHome(limite: number = 18): Foto[] {
    return this._fotos.slice(0, limite);
  }

  /**
   * Obtiene estadísticas generales
   * @returns Objeto con estadísticas de la colección
   */
  obtenerEstadisticas() {
    return {
      totalFotos: this._fotos.length,
      totalDestinos: new Set(this._fotos.map(f => f.ubicacion)).size,
      totalFavoritos: this._fotos.filter(f => f.favorito).length,
      categorias: this.obtenerConteoCategoria()
    };
  }
}
