/**
 * UTILIDAD DE LOGGING
 * 
 * Sistema de logging simple para el servidor backend.
 * En producción se puede reemplazar por Winston o similar.
 */

class Logger {
  constructor() {
    this.colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m'
    };
  }

  /**
   * Formatea el timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Formatea el mensaje de log
   */
  formatMessage(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const baseMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      return `${baseMessage}\n${JSON.stringify(data, null, 2)}`;
    }
    
    return baseMessage;
  }

  /**
   * Log de información
   */
  info(message, data = null) {
    const formattedMessage = this.formatMessage('INFO', message, data);
    console.log(`${this.colors.green}${formattedMessage}${this.colors.reset}`);
  }

  /**
   * Log de advertencia
   */
  warn(message, data = null) {
    const formattedMessage = this.formatMessage('WARN', message, data);
    console.warn(`${this.colors.yellow}${formattedMessage}${this.colors.reset}`);
  }

  /**
   * Log de error
   */
  error(message, data = null) {
    const formattedMessage = this.formatMessage('ERROR', message, data);
    console.error(`${this.colors.red}${formattedMessage}${this.colors.reset}`);
  }

  /**
   * Log de debug
   */
  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('DEBUG', message, data);
      console.log(`${this.colors.cyan}${formattedMessage}${this.colors.reset}`);
    }
  }
}

module.exports = new Logger();
