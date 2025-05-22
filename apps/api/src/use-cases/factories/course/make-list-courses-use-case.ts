import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { ListCoursesUseCase } from '@/use-cases/course/list-courses'

export function makeListCoursesUseCase() {
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new ListCoursesUseCase(coursesRepository)

  return useCase
}
