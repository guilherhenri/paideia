import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  EnrollmentRelations,
  EnrollmentsRepository,
} from '@/repositories/interfaces/enrollments-repository'

interface FindEnrollmentWithUserUseCaseRequest {
  id: string
}

export type FindEnrollmentWithUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    enrollment: EnrollmentRelations['WithUser']
  }
>

export class FindEnrollmentWithUserUseCase {
  constructor(private readonly enrollmentsRepository: EnrollmentsRepository) {}

  async execute({
    id,
  }: FindEnrollmentWithUserUseCaseRequest): Promise<FindEnrollmentWithUserUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findByIdWithUser(id)

    if (!enrollment) {
      return left(new ResourceNotFoundError('Matrícula não encontrada.'))
    }

    return right({ enrollment })
  }
}
