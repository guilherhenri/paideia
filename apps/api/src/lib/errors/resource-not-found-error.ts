import { AppError } from './app-error'

export class ResourceNotFoundError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('NOT_FOUND', message, 404, details)
  }
}
