import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  ProgressesRepository,
  ProgressRelations,
} from '@/repositories/interfaces/progresses-repository'

interface FindProgressWithLessonUseCaseRequest {
  id: string
}

export type FindProgressWithLessonUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    progress: ProgressRelations['WithLesson']
  }
>

export class FindProgressWithLessonUseCase {
  constructor(private readonly progressesRepository: ProgressesRepository) {}

  async execute({
    id,
  }: FindProgressWithLessonUseCaseRequest): Promise<FindProgressWithLessonUseCaseResponse> {
    const progress = await this.progressesRepository.findByIdWithLesson(id)

    if (!progress) {
      return left(new ResourceNotFoundError('Progresso não encontrado.'))
    }

    return right({ progress })
  }
}
