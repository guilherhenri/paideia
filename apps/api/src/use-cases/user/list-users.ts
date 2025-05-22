import type { Role, User } from '@prisma/client'

import { type Either, right } from '@/either'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface ListUsersUseCaseRequest {
  role?: Role
}

export type ListUsersUseCaseResponse = Either<
  never,
  {
    users: User[]
  }
>

export class ListUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    role,
  }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    const users = await this.usersRepository.list({ role })

    return right({ users })
  }
}
