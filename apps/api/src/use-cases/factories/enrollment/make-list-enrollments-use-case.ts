import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { ListEnrollmentsUseCase } from '@/use-cases/enrollment/list-enrollments'

export function makeListEnrollmentsUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository()

  const useCase = new ListEnrollmentsUseCase(enrollmentsRepository)

  return useCase
}
