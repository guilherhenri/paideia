import type { Role, User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { type Either, left, right } from '@/either'
import { ConflictFoundError } from '@/lib/errors/conflict-error'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface UpdateUserUseCaseRequest {
  id: string
  email?: string
  name?: string
  role?: Role
  password?: string
  picture?: string | null
}

export type UpdateUserUseCaseResponse = Either<
  ResourceNotFoundError | ConflictFoundError,
  {
    user: User
  }
>

export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    id,
    email,
    name,
    role,
    password,
    picture,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      return left(new ResourceNotFoundError('Usuário não encontrado.'))
    }

    if (email && email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(email)

      if (existingUser) {
        return left(new ConflictFoundError('E-mail já registrado.'))
      }
    }

    const passwordHash = password ? await hash(password, 6) : user.password_hash

    const updatedUser: User = {
      ...user,
      email: email ?? user.email,
      name: name ?? user.name,
      role: role ?? user.role,
      password_hash: passwordHash,
      picture: picture !== undefined ? picture : user.picture,
      updated_at: new Date(),
    }

    await this.usersRepository.save(updatedUser)

    return right({ user: updatedUser })
  }
}
