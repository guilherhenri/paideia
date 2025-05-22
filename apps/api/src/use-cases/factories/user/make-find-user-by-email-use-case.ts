import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FindUserByEmailUseCase } from '@/use-cases/user/find-user-by-email'

export function makeFindUserByEmailUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FindUserByEmailUseCase(usersRepository)

  return useCase
}
