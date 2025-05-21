import { type ErrorCode, type HttpStatusCode } from './error-codes'

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public status: HttpStatusCode,
    public details: Record<string, unknown> = {},
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export type AppErrorResponse = Omit<AppError, 'name' | 'status'>
