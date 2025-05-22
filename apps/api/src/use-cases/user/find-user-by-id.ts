import type { User } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface FindUserByIdUseCaseRequest {
  id: string
}

export type FindUserByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

export class FindUserByIdUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    id,
  }: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      return left(new ResourceNotFoundError('Usuário não encontrado.'))
    }

    return right({ user })
  }
}
