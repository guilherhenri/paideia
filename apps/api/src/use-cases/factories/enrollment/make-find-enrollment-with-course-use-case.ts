import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { FindEnrollmentWithCourseUseCase } from '@/use-cases/enrollment/find-enrollment-with-course'

export function makeFindEnrollmentWithCourseUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository()

  const useCase = new FindEnrollmentWithCourseUseCase(enrollmentsRepository)

  return useCase
}
