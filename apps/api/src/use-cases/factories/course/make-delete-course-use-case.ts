import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { DeleteCourseUseCase } from '@/use-cases/course/delete-course'

export function makeDeleteCourseUseCase() {
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new DeleteCourseUseCase(coursesRepository)

  return useCase
}
