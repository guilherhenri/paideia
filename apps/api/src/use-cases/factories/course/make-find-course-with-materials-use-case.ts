import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { FindCourseWithMaterialsUseCase } from '@/use-cases/course/find-course-with-materials'

export function makeFindCourseWithMaterialsUseCase() {
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new FindCourseWithMaterialsUseCase(coursesRepository)

  return useCase
}
