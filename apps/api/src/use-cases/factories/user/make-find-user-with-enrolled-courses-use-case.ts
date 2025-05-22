import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FindUserWithEnrolledCoursesUseCase } from '@/use-cases/user/find-user-with-enrolled-courses'

export function makeFindUserWithEnrolledCoursesUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FindUserWithEnrolledCoursesUseCase(usersRepository)

  return useCase
}
