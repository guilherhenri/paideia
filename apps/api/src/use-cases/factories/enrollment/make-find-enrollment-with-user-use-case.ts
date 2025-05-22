import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { FindEnrollmentWithUserUseCase } from '@/use-cases/enrollment/find-enrollment-with-user'

export function makeFindEnrollmentWithUserUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository()

  const useCase = new FindEnrollmentWithUserUseCase(enrollmentsRepository)

  return useCase
}
