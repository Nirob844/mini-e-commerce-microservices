import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger: Logger;

  constructor(context: string = 'App') {
    this.logger = new Logger(context);
  }

  log(message: string, context?: string) {
    if (context) {
      this.logger.log(message);
    } else {
      this.logger.log(message);
    }
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message);
  }
}
