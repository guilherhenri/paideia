import type { Role, User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { type Either, left, right } from '@/either'
import { ConflictFoundError } from '@/lib/errors/conflict-error'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface CreateUserUseCaseRequest {
  email: string
  name: string
  role: Role
  password?: string
  picture?: string
}

export type CreateUserUseCaseResponse = Either<
  ConflictFoundError,
  {
    user: User
  }
>

export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    role,
    password,
    picture,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const existingUser = await this.usersRepository.findByEmail(email)
    if (existingUser) {
      return left(new ConflictFoundError('E-mail já registrado.'))
    }

    const passwordHash = password ? await hash(password, 6) : null

    const user = await this.usersRepository.create({
      email,
      name,
      role,
      password_hash: passwordHash,
      picture: picture ?? null,
    })

    return right({ user })
  }
}
