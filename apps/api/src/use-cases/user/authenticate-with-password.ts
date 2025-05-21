import type { User } from '@prisma/client'
import { compare } from 'bcryptjs'

import { type Either, left, right } from '@/either'
import { ConflictFoundError } from '@/lib/errors/conflict-error'
import { InvalidCredentialsError } from '@/lib/errors/invalid-credentials-error'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface AuthenticateWithPasswordUseCaseRequest {
  email: string
  password: string
}

type AuthenticateWithPasswordUseCaseResponse = Either<
  InvalidCredentialsError | ConflictFoundError,
  {
    user: User
  }
>

export class AuthenticateWithPasswordUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateWithPasswordUseCaseRequest): Promise<AuthenticateWithPasswordUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    if (user.password_hash === null) {
      return left(
        new ConflictFoundError(
          'Você não possui uma senha, use o login social.',
        ),
      )
    }

    const isPasswordValid = await compare(password, user.password_hash)

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    return right({ user })
  }
}
