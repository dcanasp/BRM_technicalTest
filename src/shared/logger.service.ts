// src/shared/azure-logger.service.ts
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';

@Injectable()
export class AzureLoggerService extends ConsoleLogger {
  private readonly logger = logs.getLogger('my-app-logger');

  private getSeverity(level: LogLevel): SeverityNumber {
    switch (level) {
      case 'error': return SeverityNumber.ERROR;
      case 'warn': return SeverityNumber.WARN;
      case 'log': return SeverityNumber.INFO;
      case 'debug': return SeverityNumber.DEBUG;
      default: return SeverityNumber.INFO;
    }
  }

  log(message: any, context?: string) {
    super.log(message, context);
    this.logger.emit({
      severityNumber: this.getSeverity('log'),
      body: this.formatMessage(message, context),
      attributes: { context }
    });
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.logger.emit({
      severityNumber: this.getSeverity('error'),
      body: this.formatMessage(message, context),
      attributes: { context, stack: trace }
    });
    }

  // Repeat for warn and debug
  warn(message: any, context?: string) {
    super.warn(message, context);
    this.logger.emit({
      severityNumber: this.getSeverity('warn'),
      body: this.formatMessage(message, context),
      attributes: { context }
    });
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.logger.emit({
      severityNumber: this.getSeverity('debug'),
      body: this.formatMessage(message, context),
      attributes: { context }
    });
  }

  public formatMessage(message: any, context?: string): string {
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return context ? `[${context}] ${message}` : message;
  }
}