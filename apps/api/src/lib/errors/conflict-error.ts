import { AppError } from './app-error'

export class ConflictFoundError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('CONFLICT', message, 409, details)
  }
}
