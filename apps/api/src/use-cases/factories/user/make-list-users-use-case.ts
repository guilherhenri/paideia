import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ListUsersUseCase } from '@/use-cases/user/list-users'

export function makeListUsersUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const useCase = new ListUsersUseCase(usersRepository)

  return useCase
}
