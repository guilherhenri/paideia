import { AppError } from './app-error'

export class InvalidCredentialsError extends AppError {
  constructor(message?: string, details?: Record<string, unknown>) {
    super(
      'UNAUTHORIZED',
      message ?? 'E-mail ou senha incorretos. Verifique e tente novamente.',
      401,
      details,
    )
  }
}
