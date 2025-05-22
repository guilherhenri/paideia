import type { Enrollment } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { EnrollmentsRepository } from '@/repositories/interfaces/enrollments-repository'

interface FindEnrollmentByIdUseCaseRequest {
  id: string
}

export type FindEnrollmentByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    enrollment: Enrollment
  }
>

export class FindEnrollmentByIdUseCase {
  constructor(private readonly enrollmentsRepository: EnrollmentsRepository) {}

  async execute({
    id,
  }: FindEnrollmentByIdUseCaseRequest): Promise<FindEnrollmentByIdUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findById(id)

    if (!enrollment) {
      return left(new ResourceNotFoundError('Matrícula não encontrada.'))
    }

    return right({ enrollment })
  }
}
