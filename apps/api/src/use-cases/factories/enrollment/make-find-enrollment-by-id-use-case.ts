import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { FindEnrollmentByIdUseCase } from '@/use-cases/enrollment/find-enrollment-by-id'

export function makeFindEnrollmentByIdUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository()

  const useCase = new FindEnrollmentByIdUseCase(enrollmentsRepository)

  return useCase
}
