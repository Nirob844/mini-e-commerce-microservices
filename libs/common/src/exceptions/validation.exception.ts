import { AppException } from './app.exception';

export class ValidationException extends AppException {
  constructor(
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationException';
  }
}
