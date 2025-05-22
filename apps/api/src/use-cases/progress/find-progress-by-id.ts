import type { Progress } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { ProgressesRepository } from '@/repositories/interfaces/progresses-repository'

interface FindProgressByIdUseCaseRequest {
  id: string
}

export type FindProgressByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    progress: Progress
  }
>

export class FindProgressByIdUseCase {
  constructor(private readonly progressesRepository: ProgressesRepository) {}

  async execute({
    id,
  }: FindProgressByIdUseCaseRequest): Promise<FindProgressByIdUseCaseResponse> {
    const progress = await this.progressesRepository.findById(id)

    if (!progress) {
      return left(new ResourceNotFoundError('Progresso não encontrado.'))
    }

    return right({ progress })
  }
}
