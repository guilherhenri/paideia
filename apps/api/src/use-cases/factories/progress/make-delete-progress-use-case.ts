import { PrismaProgressesRepository } from '@/repositories/prisma/prisma-progresses-repository'
import { DeleteProgressUseCase } from '@/use-cases/progress/delete-progress'

export function makeDeleteProgressUseCase() {
  const progressesRepository = new PrismaProgressesRepository()

  const useCase = new DeleteProgressUseCase(progressesRepository)

  return useCase
}
