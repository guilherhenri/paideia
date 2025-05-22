import { PrismaProgressesRepository } from '@/repositories/prisma/prisma-progresses-repository'
import { FindProgressWithLessonUseCase } from '@/use-cases/progress/find-progress-with-lesson'

export function makeFindProgressWithLessonUseCase() {
  const progressesRepository = new PrismaProgressesRepository()

  const useCase = new FindProgressWithLessonUseCase(progressesRepository)

  return useCase
}
