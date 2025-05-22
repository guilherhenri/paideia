import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { LessonsRepository } from '@/repositories/interfaces/lessons-repository'

interface DeleteLessonUseCaseRequest {
  id: string
}

export type DeleteLessonUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteLessonUseCase {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async execute({
    id,
  }: DeleteLessonUseCaseRequest): Promise<DeleteLessonUseCaseResponse> {
    const lesson = await this.lessonsRepository.findById(id)

    if (!lesson) {
      return left(new ResourceNotFoundError('Aula não encontrada.'))
    }

    await this.lessonsRepository.delete(id)

    return right({})
  }
}
