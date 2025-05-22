import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { EnrollmentsRepository } from '@/repositories/interfaces/enrollments-repository'

interface DeleteEnrollmentUseCaseRequest {
  id: string
}

export type DeleteEnrollmentUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteEnrollmentUseCase {
  constructor(private readonly enrollmentsRepository: EnrollmentsRepository) {}

  async execute({
    id,
  }: DeleteEnrollmentUseCaseRequest): Promise<DeleteEnrollmentUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findById(id)

    if (!enrollment) {
      return left(new ResourceNotFoundError('Matrícula não encontrada.'))
    }

    await this.enrollmentsRepository.delete(id)

    return right({})
  }
}
