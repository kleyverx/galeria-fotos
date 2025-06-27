const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Logger simple (sin archivo externo por ahora)
const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data || ''),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data || ''),
  error: (message, data) => console.error(`[ERROR] ${message}`, data || '')
};

// ================================
// MIDDLEWARES GLOBALES
// ================================

// Seguridad básica
app.use(helmet({
  contentSecurityPolicy: false // Simplificado para desarrollo
}));

// CORS - Configurado para Ionic
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

// Rate limiting básico
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Más permisivo para desarrollo
  message: {
    error: 'Demasiados intentos. Inténtalo de nuevo en 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// Middlewares básicos
app.use(morgan('dev'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ================================
// CONFIGURACIÓN DE EMAIL CON MAILTRAP
// ================================

// Configuración de email desde variables de entorno
const emailConfig = {
  host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT) || 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

const emailTo = process.env.EMAIL_TO;
const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;

// Crear transportador de Nodemailer
let transporter = null;
if (emailConfig.auth.user && emailConfig.auth.pass) {
  transporter = nodemailer.createTransport(emailConfig);
  
  // Verificar conexión al iniciar
  transporter.verify((error, success) => {
    if (error) {
      logger.error('Error de conexión con Mailtrap:', error.message);
    } else {
      logger.info('✅ Conectado exitosamente a Mailtrap');
    }
  });
}

// ================================
// RUTAS
// ================================

/**
 * Health Check
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    emailConfigured: !!(emailConfig.auth.user && emailConfig.auth.pass && emailTo)
  });
});

/**
 * Validadores de formulario
 */
const contactValidation = [
  body('nombre')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre es obligatorio'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
    
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

/**
 * Enviar formulario de contacto
 */
app.post('/api/contact', contactLimiter, contactValidation, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Datos inválidos:', errors.array());
      
      return res.status(400).json({
        success: false,
        message: 'Datos del formulario inválidos',
        errors: errors.array()
      });
    }

    const { nombre, email, asunto, mensaje, suscripcion } = req.body;
    
    logger.info('Nuevo contacto recibido:', { nombre, email, asunto });

    // Verificar configuración de email
    if (!emailConfig.auth.user || !emailConfig.auth.pass || !emailTo) {
      logger.warn('Email no configurado completamente');
      
      return res.status(500).json({
        success: false,
        message: 'Servicio de email no configurado. Revisa las variables de entorno.',
        code: 'EMAIL_NOT_CONFIGURED'
      });
    }

    // ENVÍO REAL DE EMAIL USANDO MAILTRAP
    try {
      const emailData = {
        from: emailFrom,
        to: emailTo,
        subject: `Nuevo mensaje desde Kleyver App: ${getAsuntoTexto(asunto)}`,
        html: generateEmailHTML({ nombre, email, asunto: getAsuntoTexto(asunto), mensaje, suscripcion }),
        text: `Nuevo mensaje de ${nombre} (${email})\nAsunto: ${getAsuntoTexto(asunto)}\nMensaje: ${mensaje}`
      };

      logger.info('Enviando email a Mailtrap...');
      
      const info = await transporter.sendMail(emailData);
      
      logger.info('✅ Email enviado exitosamente:', {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected
      });

      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: 'Mensaje enviado correctamente',
        messageId: info.messageId,
        debug: {
          emailConfigured: true,
          simulationMode: false,
          emailSent: true,
          accepted: info.accepted,
          rejected: info.rejected
        }
      });

    } catch (emailError) {
      logger.error('❌ Error enviando email:', emailError.message);
      
      // Si hay error de email, respondemos con error pero con detalles útiles
      res.status(500).json({
        success: false,
        message: 'Error enviando el mensaje. Inténtalo de nuevo.',
        code: 'EMAIL_SEND_ERROR',
        debug: {
          emailConfigured: true,
          simulationMode: false,
          error: emailError.message
        }
      });
    }

  } catch (error) {
    logger.error('Error en endpoint de contacto:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// ================================
// FUNCIONES AUXILIARES
// ================================

function getAsuntoTexto(codigo) {
  const asuntos = {
    'info': 'Información sobre destinos',
    'collab': 'Propuesta de colaboración',
    'feedback': 'Comentarios sobre fotografías',
    'other': 'Consulta general'
  };
  return asuntos[codigo] || 'Consulta general';
}

function generateEmailHTML(data) {
  return `
    <h2>📧 Nuevo mensaje desde Kleyver App</h2>
    <p><strong>Nombre:</strong> ${data.nombre}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Asunto:</strong> ${data.asunto}</p>
    <p><strong>Suscripción:</strong> ${data.suscripcion ? 'Sí' : 'No'}</p>
    <div style="border-left: 4px solid #667eea; padding-left: 15px; margin: 20px 0;">
      <p><strong>Mensaje:</strong></p>
      <p>${data.mensaje}</p>
    </div>
    <hr>
    <p style="color: #666; font-size: 12px;">
      Enviado desde Kleyver App - ${new Date().toLocaleString('es-ES')}
    </p>
  `;
}

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
  logger.error('Error no manejado:', error.message);

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
  logger.info(`🚀 Servidor backend iniciado en puerto ${PORT}`);
  logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📧 Email configurado: ${!!(emailConfig.auth.user && emailConfig.auth.pass && emailTo)}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
  logger.info(`📬 Endpoint contacto: http://localhost:${PORT}/api/contact`);
  
  if (!emailConfig.auth.user) {
    logger.warn('⚠️  EMAIL_USER no configurado en .env');
  }
  if (!emailConfig.auth.pass) {
    logger.warn('⚠️  EMAIL_PASS no configurado en .env');
  }
  if (!emailTo) {
    logger.warn('⚠️  EMAIL_TO no configurado en .env');
  }
});

module.exports = app;
