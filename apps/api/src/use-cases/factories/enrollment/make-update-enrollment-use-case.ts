import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateEnrollmentUseCase } from '@/use-cases/enrollment/update-enrollment'

export function makeUpdateEnrollmentUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository()
  const usersRepository = new PrismaUsersRepository()
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new UpdateEnrollmentUseCase(
    enrollmentsRepository,
    usersRepository,
    coursesRepository,
  )

  return useCase
}
