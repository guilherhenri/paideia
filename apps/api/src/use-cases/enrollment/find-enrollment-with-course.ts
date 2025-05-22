import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  EnrollmentRelations,
  EnrollmentsRepository,
} from '@/repositories/interfaces/enrollments-repository'

interface FindEnrollmentWithCourseUseCaseRequest {
  id: string
}

export type FindEnrollmentWithCourseUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    enrollment: EnrollmentRelations['WithCourse']
  }
>

export class FindEnrollmentWithCourseUseCase {
  constructor(private readonly enrollmentsRepository: EnrollmentsRepository) {}

  async execute({
    id,
  }: FindEnrollmentWithCourseUseCaseRequest): Promise<FindEnrollmentWithCourseUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findByIdWithCourse(id)

    if (!enrollment) {
      return left(new ResourceNotFoundError('Matrícula não encontrada.'))
    }

    return right({ enrollment })
  }
}
