import { CreateUserUseCase } from '@/use-cases/user/create-user'

export function makeCreateUserUseCase() {
  const useCase = new CreateUserUseCase()

  return useCase
}
