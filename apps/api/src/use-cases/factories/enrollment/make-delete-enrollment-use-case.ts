import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { DeleteEnrollmentUseCase } from '@/use-cases/enrollment/delete-enrollment'

export function makeDeleteEnrollmentUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository()

  const useCase = new DeleteEnrollmentUseCase(enrollmentsRepository)

  return useCase
}
