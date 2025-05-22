import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { ListLessonsUseCase } from '@/use-cases/lesson/list-lessons'

export function makeListLessonsUseCase() {
  const lessonsRepository = new PrismaLessonsRepository()

  const useCase = new ListLessonsUseCase(lessonsRepository)

  return useCase
}
