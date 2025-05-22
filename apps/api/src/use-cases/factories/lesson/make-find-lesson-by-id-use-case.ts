import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { FindLessonByIdUseCase } from '@/use-cases/lesson/find-lesson-by-id'

export function makeFindLessonByIdUseCase() {
  const lessonsRepository = new PrismaLessonsRepository()

  const useCase = new FindLessonByIdUseCase(lessonsRepository)

  return useCase
}
