import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { FindCourseWithModulesUseCase } from '@/use-cases/course/find-course-with-modules'

export function makeFindCourseWithModulesUseCase() {
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new FindCourseWithModulesUseCase(coursesRepository)

  return useCase
}
