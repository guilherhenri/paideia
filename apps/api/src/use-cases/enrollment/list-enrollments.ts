import type { Enrollment } from '@prisma/client'

import { type Either, right } from '@/either'
import type { EnrollmentsRepository } from '@/repositories/interfaces/enrollments-repository'

interface ListEnrollmentsUseCaseRequest {
  userId?: string
  courseId?: string
}

export type ListEnrollmentsUseCaseResponse = Either<
  never,
  {
    enrollments: Enrollment[]
  }
>

export class ListEnrollmentsUseCase {
  constructor(private readonly enrollmentsRepository: EnrollmentsRepository) {}

  async execute({
    userId,
    courseId,
  }: ListEnrollmentsUseCaseRequest): Promise<ListEnrollmentsUseCaseResponse> {
    const enrollments = await this.enrollmentsRepository.list({
      userId,
      courseId,
    })

    return right({ enrollments })
  }
}
