import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { FindCourseWithInstructorUseCase } from '@/use-cases/course/find-course-with-instructor'

export function makeFindCourseWithInstructorUseCase() {
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new FindCourseWithInstructorUseCase(coursesRepository)

  return useCase
}
