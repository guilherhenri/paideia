import { PrismaProgressesRepository } from '@/repositories/prisma/prisma-progresses-repository'
import { FindProgressByIdUseCase } from '@/use-cases/progress/find-progress-by-id'

export function makeFindProgressByIdUseCase() {
  const progressesRepository = new PrismaProgressesRepository()

  const useCase = new FindProgressByIdUseCase(progressesRepository)

  return useCase
}
