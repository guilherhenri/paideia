import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { FindCourseByIdUseCase } from '@/use-cases/course/find-course-by-id'

export function makeFindCourseByIdUseCase() {
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new FindCourseByIdUseCase(coursesRepository)

  return useCase
}
