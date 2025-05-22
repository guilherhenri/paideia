import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  ProgressesRepository,
  ProgressRelations,
} from '@/repositories/interfaces/progresses-repository'

interface FindProgressWithUserUseCaseRequest {
  id: string
}

export type FindProgressWithUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    progress: ProgressRelations['WithUser']
  }
>

export class FindProgressWithUserUseCase {
  constructor(private readonly progressesRepository: ProgressesRepository) {}

  async execute({
    id,
  }: FindProgressWithUserUseCaseRequest): Promise<FindProgressWithUserUseCaseResponse> {
    const progress = await this.progressesRepository.findByIdWithUser(id)

    if (!progress) {
      return left(new ResourceNotFoundError('Progresso não encontrado.'))
    }

    return right({ progress })
  }
}
