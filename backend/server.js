/**
 * SERVIDOR BACKEND PARA KLEYVER APP
 * 
 * Este servidor Express proporciona una API REST para manejar
 * el formulario de contacto de la aplicación Ionic.
 * 
 * Características:
 * - API REST con Express.js
 * - Envío de emails con Nodemailer
 * - Validación de datos con express-validator
 * - Seguridad con Helmet y rate limiting
 * - CORS configurado para Ionic
 * - Logging con Morgan
 * - Compresión gzip
 * 
 * Endpoints:
 * POST /api/contact - Enviar formulario de contacto
 * GET /api/health - Health check del servidor
 * 
 * Uso:
 * npm install
 * npm run dev (desarrollo)
 * npm start (producción)
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Importar servicios
const emailService = require('./services/emailService');
const logger = require('./utils/logger');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// MIDDLEWARES GLOBALES
// ================================

// Seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS - Configurado específicamente para Ionic
app.use(cors({
  origin: [
    'http://localhost:8100',    // Ionic serve
    'http://localhost:4200',    // Angular serve
    'capacitor://localhost',    // Capacitor iOS
    'https://localhost'         // Capacitor Android
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting - Prevenir spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 envíos por IP cada 15 minutos
  message: {
    error: 'Demasiados intentos de envío. Inténtalo de nuevo en 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Logging
app.use(morgan('combined'));

// Compresión
app.use(compression());

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ================================
// VALIDADORES
// ================================

const contactValidation = [
  body('nombre')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre es obligatorio y debe tener máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido')
    .isLength({ max: 254 })
    .withMessage('El email es demasiado largo'),
    
  body('asunto')
    .isIn(['info', 'collab', 'feedback', 'other'])
    .withMessage('Asunto no válido'),
    
  body('mensaje')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('El mensaje debe tener entre 10 y 1000 caracteres'),
    
  body('suscripcion')
    .isBoolean()
    .withMessage('Suscripción debe ser true o false')
];

// ================================
// RUTAS
// ================================

/**
 * Health Check - Verificar que el servidor esté funcionando
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Enviar formulario de contacto
 * 
 * Recibe los datos del formulario, los valida y envía un email
 */
app.post('/api/contact', contactLimiter, contactValidation, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Datos de formulario inválidos:', {
        errors: errors.array(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(400).json({
        success: false,
        message: 'Datos del formulario inválidos',
        errors: errors.array()
      });
    }

    const { nombre, email, asunto, mensaje, suscripcion } = req.body;
    
    // Log del intento de envío
    logger.info('Nuevo intento de contacto:', {
      nombre,
      email,
      asunto,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    // Enviar email
    const emailResult = await emailService.enviarEmailContacto({
      nombre,
      email,
      asunto,
      mensaje,
      suscripcion,
      metadata: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      }
    });

    if (emailResult.success) {
      // Envío exitoso
      logger.info('Email de contacto enviado exitosamente:', {
        nombre,
        email,
        messageId: emailResult.messageId
      });

      // Respuesta al cliente
      res.status(200).json({
        success: true,
        message: 'Mensaje enviado correctamente. Te responderemos pronto.',
        messageId: emailResult.messageId
      });

      // Opcional: Enviar confirmación al usuario
      if (suscripcion) {
        await emailService.enviarConfirmacionUsuario({
          nombre,
          email
        }).catch(error => {
          logger.warn('No se pudo enviar confirmación al usuario:', error.message);
        });
      }

    } else {
      // Error en el envío
      logger.error('Error al enviar email de contacto:', emailResult.error);
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor. Inténtalo de nuevo más tarde.',
        code: 'EMAIL_SEND_FAILED'
      });
    }

  } catch (error) {
    // Error crítico
    logger.error('Error crítico en endpoint de contacto:', {
      error: error.message,
      stack: error.stack,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// ================================
// MANEJO DE ERRORES
// ================================

// 404 - Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    code: 'NOT_FOUND'
  });
});

// Error handler global
app.use((error, req, res, next) => {
  logger.error('Error no manejado:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    code: 'INTERNAL_SERVER_ERROR'
  });
});

// ================================
// INICIAR SERVIDOR
// ================================

app.listen(PORT, () => {
  logger.info(`🚀 Servidor iniciado en puerto ${PORT}`);
  logger.info(`📧 Servicio de email: ${emailService.isConfigured() ? 'Configurado' : 'No configurado'}`);
  logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  logger.info('Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

module.exports = app;
