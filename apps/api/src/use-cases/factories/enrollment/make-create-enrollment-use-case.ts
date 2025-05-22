import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateEnrollmentUseCase } from '@/use-cases/enrollment/create-enrollment'

export function makeCreateEnrollmentUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository()
  const usersRepository = new PrismaUsersRepository()
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new CreateEnrollmentUseCase(
    enrollmentsRepository,
    usersRepository,
    coursesRepository,
  )

  return useCase
}
