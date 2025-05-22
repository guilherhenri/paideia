import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { ProgressesRepository } from '@/repositories/interfaces/progresses-repository'

interface DeleteProgressUseCaseRequest {
  id: string
}

export type DeleteProgressUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteProgressUseCase {
  constructor(private readonly progressesRepository: ProgressesRepository) {}

  async execute({
    id,
  }: DeleteProgressUseCaseRequest): Promise<DeleteProgressUseCaseResponse> {
    const progress = await this.progressesRepository.findById(id)

    if (!progress) {
      return left(new ResourceNotFoundError('Progresso não encontrado.'))
    }

    await this.progressesRepository.delete(id)

    return right({})
  }
}
