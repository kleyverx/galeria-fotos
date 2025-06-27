#!/bin/bash

# 🚀 SCRIPT DE CONFIGURACIÓN RÁPIDA PARA KLEYVER APP
# ===================================================

echo "🎯 Configurando Kleyver App Backend..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para prints coloridos
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "📋 Opciones disponibles:"
echo "1. Solo EmailJS (Configuración rápida)"
echo "2. Solo Backend Node.js"  
echo "3. Sistema Híbrido (Recomendado)"

read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        print_status "Configurando EmailJS..."
        print_warning "Necesitas crear cuenta en https://emailjs.com"
        print_warning "Después actualiza las claves en src/app/services/email.service.ts"
        
        # Deshabilitar backend
        sed -i '' 's/PREFER_BACKEND = true/PREFER_BACKEND = false/' src/app/services/email.service.ts
        
        print_status "EmailJS configurado. ¡Completa las claves y estará listo!"
        ;;
        
    2)
        print_status "Configurando Backend Node.js..."
        
        # Ir al directorio backend
        cd backend
        
        # Instalar dependencias
        print_status "Instalando dependencias del backend..."
        npm install
        
        # Crear archivo .env
        cp .env.example .env
        
        print_warning "Configura las variables en backend/.env"
        print_status "Backend configurado. Ejecuta 'npm run dev' en /backend"
        ;;
        
    3)
        print_status "Configurando Sistema Híbrido..."
        
        # Configurar backend
        cd backend
        npm install
        cp .env.example .env
        cd ..
        
        # Mantener configuración híbrida
        print_status "Sistema híbrido configurado"
        print_warning "1. Configura backend/.env para Node.js"
        print_warning "2. Configura claves EmailJS en email.service.ts"
        print_status "¡Tendrás doble respaldo automático!"
        ;;
        
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

echo ""
print_status "🎉 Configuración completada"
echo ""
echo "📋 Para probar el formulario:"
echo "   1. ionic serve"
echo "   2. Navega a la página de Contacto"
echo "   3. Completa y envía el formulario"
echo ""
echo "📖 Ver documentación completa en: DOCUMENTACION_BACKEND.md"
