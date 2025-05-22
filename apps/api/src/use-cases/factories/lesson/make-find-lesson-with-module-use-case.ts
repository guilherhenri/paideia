import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { FindLessonWithModuleUseCase } from '@/use-cases/lesson/find-lesson-with-module'

export function makeFindLessonWithModuleUseCase() {
  const lessonsRepository = new PrismaLessonsRepository()

  const useCase = new FindLessonWithModuleUseCase(lessonsRepository)

  return useCase
}
