import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CourseMaterialsRepository } from '@/repositories/interfaces/course-materials-repository'

interface DeleteCourseMaterialUseCaseRequest {
  id: string
}

export type DeleteCourseMaterialUseCaseResponse = Either<
  ResourceNotFoundError,
  {}
>

export class DeleteCourseMaterialUseCase {
  constructor(
    private readonly courseMaterialsRepository: CourseMaterialsRepository,
  ) {}

  async execute({
    id,
  }: DeleteCourseMaterialUseCaseRequest): Promise<DeleteCourseMaterialUseCaseResponse> {
    const courseMaterial = await this.courseMaterialsRepository.findById(id)

    if (!courseMaterial) {
      return left(
        new ResourceNotFoundError('Material do curso não encontrado.'),
      )
    }

    await this.courseMaterialsRepository.delete(id)

    return right({})
  }
}
