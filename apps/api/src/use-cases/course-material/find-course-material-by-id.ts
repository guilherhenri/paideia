import type { CourseMaterial } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CourseMaterialsRepository } from '@/repositories/interfaces/course-materials-repository'

interface FindCourseMaterialByIdUseCaseRequest {
  id: string
}

export type FindCourseMaterialByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseMaterial: CourseMaterial
  }
>

export class FindCourseMaterialByIdUseCase {
  constructor(
    private readonly courseMaterialsRepository: CourseMaterialsRepository,
  ) {}

  async execute({
    id,
  }: FindCourseMaterialByIdUseCaseRequest): Promise<FindCourseMaterialByIdUseCaseResponse> {
    const courseMaterial = await this.courseMaterialsRepository.findById(id)

    if (!courseMaterial) {
      return left(
        new ResourceNotFoundError('Material do curso não encontrado.'),
      )
    }

    return right({ courseMaterial })
  }
}
