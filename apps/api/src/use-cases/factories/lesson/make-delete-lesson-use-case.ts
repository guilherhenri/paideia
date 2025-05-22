import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { DeleteLessonUseCase } from '@/use-cases/lesson/delete-lesson'

export function makeDeleteLessonUseCase() {
  const lessonsRepository = new PrismaLessonsRepository()

  const useCase = new DeleteLessonUseCase(lessonsRepository)

  return useCase
}
