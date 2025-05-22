import { PrismaProgressesRepository } from '@/repositories/prisma/prisma-progresses-repository'
import { FindProgressWithUserUseCase } from '@/use-cases/progress/find-progress-with-user'

export function makeFindProgressWithUserUseCase() {
  const progressesRepository = new PrismaProgressesRepository()

  const useCase = new FindProgressWithUserUseCase(progressesRepository)

  return useCase
}
