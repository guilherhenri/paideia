import type { User } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface FindUserByEmailUseCaseRequest {
  email: string
}

export type FindUserByEmailUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

export class FindUserByEmailUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
  }: FindUserByEmailUseCaseRequest): Promise<FindUserByEmailUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new ResourceNotFoundError('Usuário não encontrado.'))
    }

    return right({ user })
  }
}
