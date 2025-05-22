import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  CourseMaterialRelations,
  CourseMaterialsRepository,
} from '@/repositories/interfaces/course-materials-repository'

interface FindCourseMaterialWithCourseUseCaseRequest {
  id: string
}

export type FindCourseMaterialWithCourseUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseMaterial: CourseMaterialRelations['WithCourse']
  }
>

export class FindCourseMaterialWithCourseUseCase {
  constructor(
    private readonly courseMaterialsRepository: CourseMaterialsRepository,
  ) {}

  async execute({
    id,
  }: FindCourseMaterialWithCourseUseCaseRequest): Promise<FindCourseMaterialWithCourseUseCaseResponse> {
    const courseMaterial =
      await this.courseMaterialsRepository.findByIdWithCourse(id)

    if (!courseMaterial) {
      return left(
        new ResourceNotFoundError('Material do curso não encontrado.'),
      )
    }

    return right({ courseMaterial })
  }
}
