import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  LessonRelations,
  LessonsRepository,
} from '@/repositories/interfaces/lessons-repository'

interface FindLessonWithModuleUseCaseRequest {
  id: string
}

export type FindLessonWithModuleUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    lesson: LessonRelations['WithModule']
  }
>

export class FindLessonWithModuleUseCase {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async execute({
    id,
  }: FindLessonWithModuleUseCaseRequest): Promise<FindLessonWithModuleUseCaseResponse> {
    const lesson = await this.lessonsRepository.findByIdWithModule(id)

    if (!lesson) {
      return left(new ResourceNotFoundError('Aula não encontrada.'))
    }

    return right({ lesson })
  }
}
