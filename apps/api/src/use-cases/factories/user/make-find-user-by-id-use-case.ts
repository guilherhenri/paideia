import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FindUserByIdUseCase } from '@/use-cases/user/find-user-by-id'

export function makeFindUserByIdUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FindUserByIdUseCase(usersRepository)

  return useCase
}
