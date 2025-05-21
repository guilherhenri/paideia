import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateWithPasswordUseCase } from '@/use-cases/user/authenticate-with-password'

export function makeAuthenticateWithPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const useCase = new AuthenticateWithPasswordUseCase(usersRepository)

  return useCase
}
