import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface DeleteUserUseCaseRequest {
  id: string
}

export type DeleteUserUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    id,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      return left(new ResourceNotFoundError('Usuário não encontrado.'))
    }

    await this.usersRepository.delete(id)

    return right({})
  }
}
