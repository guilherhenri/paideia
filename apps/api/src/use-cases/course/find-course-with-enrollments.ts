import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  CourseRelations,
  CoursesRepository,
} from '@/repositories/interfaces/courses-repository'

interface FindCourseWithEnrollmentsUseCaseRequest {
  id: string
}

export type FindCourseWithEnrollmentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    course: CourseRelations['WithEnrollments']
  }
>

export class FindCourseWithEnrollmentsUseCase {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute({
    id,
  }: FindCourseWithEnrollmentsUseCaseRequest): Promise<FindCourseWithEnrollmentsUseCaseResponse> {
    const course = await this.coursesRepository.findByIdWithEnrollments(id)

    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    return right({ course })
  }
}
