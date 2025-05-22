import { PrismaProgressesRepository } from '@/repositories/prisma/prisma-progresses-repository'
import { ListProgressUseCase } from '@/use-cases/progress/list-progress'

export function makeListProgressUseCase() {
  const progressesRepository = new PrismaProgressesRepository()

  const useCase = new ListProgressUseCase(progressesRepository)

  return useCase
}
