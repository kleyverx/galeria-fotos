# Kleyver App

## Descripción

Kleyver App es una aplicación móvil híbrida desarrollada con Ionic y Angular que permite gestionar y visualizar una galería de fotos. La aplicación está diseñada para funcionar en dispositivos iOS y Android, ofreciendo una experiencia de usuario nativa.

## Características Principales

- **Galería de Fotos**: Visualización de imágenes con animaciones
- **Perfil de Fotógrafo**: Sección de información personal y profesional
- **Formulario de Contacto**: Comunicación directa con validaciones en tiempo real
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla y dispositivos
- **Soporte Multiplataforma**: Funciona en iOS y Android desde una única base de código

## Requisitos Previos

Para trabajar con este proyecto, necesitarás tener instalado:

- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **Angular CLI** (v19)
- **Ionic CLI** (v8)
- **Capacitor** (v7)
- **Xcode** (para desarrollo en iOS, solo Mac)
- **Android Studio** (para desarrollo en Android)
- **Git** (para control de versiones)

## Instalación

Sigue estos pasos para configurar el entorno de desarrollo:

```bash
# Clonar el repositorio
git clone https://github.com/kleyverx/galeria-fotos.git
cd kleyver-app

# Instalar dependencias
npm install

# Instalar Ionic CLI globalmente (si no lo tienes)
npm install -g @ionic/cli
```

## Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo con recarga en caliente
npm start
# o
ionic serve

# Compilar para producción
npm run build
# o
ionic build

# Añadir plataformas nativas
ionic cap add ios
ionic cap add android

# Sincronizar cambios con plataformas nativas
ionic cap sync

# Abrir proyecto en Xcode (iOS)
ionic cap open ios

# Abrir proyecto en Android Studio
ionic cap open android
```

## Estructura del Proyecto

```
kleyver-app/
├── src/                      # Código fuente de la aplicación
│   ├── app/                  # Componentes, servicios y lógica de la app
│   │   ├── components/       # Componentes reutilizables
│   │   ├── directives/       # Directivas personalizadas
│   │   ├── home/             # Página principal con galería
│   │   ├── pages/            # Páginas adicionales (contacto, info personal)
│   │   └── services/         # Servicios para lógica de negocio
│   ├── assets/               # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── environments/         # Configuraciones de entorno
│   └── theme/                # Variables y estilos globales
├── android/                  # Proyecto nativo de Android (generado por Capacitor)
├── ios/                      # Proyecto nativo de iOS (generado por Capacitor)
├── www/                      # Build de producción (generado al compilar)
├── capacitor.config.ts       # Configuración de Capacitor
├── angular.json              # Configuración de Angular
└── ionic.config.json         # Configuración de Ionic
```

## Navegación de la Aplicación

La aplicación utiliza el sistema de rutas de Angular con lazy loading para optimizar el rendimiento:

- **/** o **/inicio**: Página principal con galería de fotos
- **/informacion-personal**: Perfil del fotógrafo con información profesional
- **/contacto**: Formulario de contacto con validaciones

## Funcionalidades Pendientes

- **Sistema de Favoritos**: La funcionalidad para marcar fotos como favoritas está planeada para futuras versiones pero no está habilitada actualmente.
- **Filtros de Imágenes**: Se planea añadir capacidad para aplicar filtros a las imágenes.
- **Compartir en Redes Sociales**: Integración con plataformas sociales en desarrollo.

## Conocimientos Técnicos Requeridos

Para desarrollar o mantener esta aplicación se recomienda tener conocimientos en:

1. **Angular (v19+)**:
   - Componentes standalone
   - Sistema de routing con lazy loading
   - Servicios e inyección de dependencias
   - Formularios reactivos

2. **Ionic Framework (v8+)**:
   - Componentes UI de Ionic
   - Navegación y ciclo de vida de páginas
   - Temas y estilos personalizados

3. **TypeScript**:
   - Tipos estáticos
   - Interfaces y clases
   - Programación orientada a objetos

4. **Capacitor**:
   - Configuración de plugins nativos
   - Gestión de permisos de dispositivo
   - Compilación para plataformas nativas

5. **CSS/SCSS**:
   - Variables CSS
   - Diseño responsivo
   - Animaciones y transiciones

## Compilación para Producción

Para generar una versión de producción y preparar la aplicación para su distribución:

```bash
# Construir la versión de producción
ionic build --prod

# Sincronizar con los proyectos nativos
ionic cap copy
ionic cap sync

# Generar recursos (íconos y splash screens)
ionic cap generate

# Abrir en IDE nativo para compilación final
ionic cap open ios     # Para iOS
ionic cap open android # Para Android
```

## Solución de Problemas Comunes

- **Error en la instalación de dependencias**: Asegúrate de usar la versión correcta de Node.js y npm
- **Problemas de compilación nativa**: Verifica que Xcode o Android Studio estén correctamente configurados
- **Errores en plugins nativos**: Ejecuta `ionic cap sync` para sincronizar los cambios
- **Problemas con la galería de fotos**: Actualmente solo está habilitada la visualización de imágenes. El sistema de favoritos no está implementado.

## Contribución

Si deseas contribuir al proyecto, sigue estas pautas:

1. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
2. Haz commit de tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
3. Sube los cambios a tu fork (`git push origin feature/nueva-funcionalidad`)
4. Crea un Pull Request



## Contacto

Para más información, contacta al equipo de desarrollo en Kleyvercell2@gmail.com .
