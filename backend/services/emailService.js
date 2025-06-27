/**
 * SERVICIO DE EMAIL CON NODEMAILER
 * 
 * Este servicio maneja el envío de emails usando Nodemailer.
 * Soporta múltiples proveedores de email (Gmail, Outlook, etc.)
 * 
 * Configuración requerida en .env:
 * EMAIL_HOST=smtp.gmail.com
 * EMAIL_PORT=587
 * EMAIL_USER=tu-email@gmail.com
 * EMAIL_PASS=tu-contraseña-de-app
 * EMAIL_FROM=tu-email@gmail.com
 * EMAIL_TO=destinatario@email.com
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
    this.init();
  }

  /**
   * Inicializa el transportador de email
   */
  init() {
    try {
      // Configuración del transportador
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true para puerto 465, false para otros
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // Contraseña de aplicación para Gmail
        },
        // Configuraciones adicionales para Gmail
        tls: {
          rejectUnauthorized: false
        }
      });

      this.isInitialized = true;
      logger.info('✅ Servicio de email inicializado correctamente');

    } catch (error) {
      logger.error('❌ Error al inicializar servicio de email:', error.message);
      this.isInitialized = false;
    }
  }

  /**
   * Verifica si el servicio está configurado correctamente
   */
  isConfigured() {
    return this.isInitialized && 
           process.env.EMAIL_USER && 
           process.env.EMAIL_PASS &&
           process.env.EMAIL_TO;
  }

  /**
   * Verifica la conexión con el servidor de email
   */
  async verificarConexion() {
    if (!this.isConfigured()) {
      throw new Error('Servicio de email no configurado');
    }

    try {
      await this.transporter.verify();
      logger.info('✅ Conexión con servidor de email verificada');
      return true;
    } catch (error) {
      logger.error('❌ Error al verificar conexión de email:', error.message);
      throw error;
    }
  }

  /**
   * Envía un email de contacto
   * 
   * @param {Object} datos - Datos del formulario
   * @returns {Object} Resultado del envío
   */
  async enviarEmailContacto(datos) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Servicio de email no configurado correctamente'
      };
    }

    try {
      const { nombre, email, asunto, mensaje, suscripcion, metadata } = datos;

      // Obtener texto del asunto
      const asuntoTexto = this.getAsuntoTexto(asunto);

      // Configurar el email
      const mailOptions = {
        from: {
          name: 'Kleyver App - Formulario de Contacto',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER
        },
        to: process.env.EMAIL_TO,
        subject: `Nuevo mensaje: ${asuntoTexto}`,
        html: this.generarPlantillaContacto({
          nombre,
          email,
          asunto: asuntoTexto,
          mensaje,
          suscripcion,
          metadata
        }),
        text: this.generarTextoPlano({
          nombre,
          email,
          asunto: asuntoTexto,
          mensaje,
          suscripcion
        }),
        replyTo: email // Para poder responder directamente
      };

      // Enviar el email
      const info = await this.transporter.sendMail(mailOptions);
      
      logger.info('✅ Email de contacto enviado:', {
        messageId: info.messageId,
        from: email,
        name: nombre
      });

      return {
        success: true,
        messageId: info.messageId,
        info: info
      };

    } catch (error) {
      logger.error('❌ Error al enviar email de contacto:', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Envía una confirmación al usuario
   * 
   * @param {Object} datos - Datos del usuario
   * @returns {Object} Resultado del envío
   */
  async enviarConfirmacionUsuario(datos) {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Servicio de email no configurado'
      };
    }

    try {
      const { nombre, email } = datos;

      const mailOptions = {
        from: {
          name: 'Kleyver Urbina - Fotógrafo',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER
        },
        to: email,
        subject: 'Confirmación - Hemos recibido tu mensaje',
        html: this.generarPlantillaConfirmacion(nombre),
        text: `Hola ${nombre},\n\nGracias por contactarme a través de mi app de fotografías. He recibido tu mensaje y te responderé pronto.\n\n¡Saludos!\nKleyver Urbina`
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      logger.info('✅ Confirmación enviada al usuario:', {
        messageId: info.messageId,
        to: email
      });

      return {
        success: true,
        messageId: info.messageId
      };

    } catch (error) {
      logger.warn('⚠️ No se pudo enviar confirmación al usuario:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Convierte código de asunto a texto
   */
  getAsuntoTexto(codigo) {
    const asuntos = {
      'info': 'Información sobre destinos',
      'collab': 'Propuesta de colaboración',
      'feedback': 'Comentarios sobre fotografías',
      'other': 'Consulta general'
    };
    return asuntos[codigo] || 'Consulta general';
  }

  /**
   * Genera la plantilla HTML para email de contacto
   */
  generarPlantillaContacto(datos) {
    const { nombre, email, asunto, mensaje, suscripcion, metadata } = datos;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { background: white; padding: 10px; border-left: 4px solid #667eea; margin-top: 5px; }
        .metadata { background: #e9ecef; padding: 10px; border-radius: 4px; font-size: 12px; color: #666; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📧 Nuevo mensaje desde Kleyver App</h2>
          <p>Formulario de contacto completado</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Nombre:</div>
            <div class="value">${nombre}</div>
          </div>
          
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value">${email}</div>
          </div>
          
          <div class="field">
            <div class="label">📋 Asunto:</div>
            <div class="value">${asunto}</div>
          </div>
          
          <div class="field">
            <div class="label">💬 Mensaje:</div>
            <div class="value">${mensaje}</div>
          </div>
          
          <div class="field">
            <div class="label">📬 Desea suscribirse:</div>
            <div class="value">${suscripcion ? '✅ Sí' : '❌ No'}</div>
          </div>
          
          ${metadata ? `
          <div class="metadata">
            <strong>Información técnica:</strong><br>
            🕒 Fecha: ${metadata.timestamp}<br>
            🌐 IP: ${metadata.ip}<br>
            💻 Navegador: ${metadata.userAgent}
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Genera texto plano para el email
   */
  generarTextoPlano(datos) {
    const { nombre, email, asunto, mensaje, suscripcion } = datos;
    
    return `
NUEVO MENSAJE DESDE KLEYVER APP
===============================

Nombre: ${nombre}
Email: ${email}
Asunto: ${asunto}
Suscripción: ${suscripcion ? 'Sí' : 'No'}

Mensaje:
--------
${mensaje}

===============================
Enviado desde Kleyver App
    `.trim();
  }

  /**
   * Genera plantilla de confirmación para el usuario
   */
  generarPlantillaConfirmacion(nombre) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📸 ¡Gracias por contactarme!</h2>
        </div>
        <div class="content">
          <p>Hola <strong>${nombre}</strong>,</p>
          
          <p>He recibido tu mensaje a través de mi aplicación de fotografías y viajes. Te agradezco mucho por tomarte el tiempo de escribirme.</p>
          
          <p>Revisaré tu mensaje y te responderé lo antes posible. Si tienes alguna pregunta urgente, no dudes en contactarme directamente.</p>
          
          <p>¡Espero poder ayudarte y compartir mi pasión por la fotografía y los viajes contigo!</p>
          
          <p>Saludos cordiales,<br>
          <strong>Kleyver Urbina</strong><br>
          📸 Fotógrafo Viajero</p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático de confirmación desde Kleyver App</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();
