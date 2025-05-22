import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { FindCourseWithEnrollmentsUseCase } from '@/use-cases/course/find-course-with-enrollments'

export function makeFindCourseWithEnrollmentsUseCase() {
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new FindCourseWithEnrollmentsUseCase(coursesRepository)

  return useCase
}
