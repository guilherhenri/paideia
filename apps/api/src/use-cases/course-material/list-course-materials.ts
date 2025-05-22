import type { CourseMaterial } from '@prisma/client'

import { type Either, right } from '@/either'
import type { CourseMaterialsRepository } from '@/repositories/interfaces/course-materials-repository'

interface ListCourseMaterialsUseCaseRequest {
  courseId?: string
}

export type ListCourseMaterialsUseCaseResponse = Either<
  never,
  {
    courseMaterials: CourseMaterial[]
  }
>

export class ListCourseMaterialsUseCase {
  constructor(
    private readonly courseMaterialsRepository: CourseMaterialsRepository,
  ) {}

  async execute({
    courseId,
  }: ListCourseMaterialsUseCaseRequest): Promise<ListCourseMaterialsUseCaseResponse> {
    const courseMaterials = await this.courseMaterialsRepository.list({
      courseId,
    })

    return right({ courseMaterials })
  }
}
