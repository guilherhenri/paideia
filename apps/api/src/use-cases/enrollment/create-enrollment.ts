import type { Enrollment } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'
import type { EnrollmentsRepository } from '@/repositories/interfaces/enrollments-repository'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface CreateEnrollmentUseCaseRequest {
  userId: string
  courseId: string
  accessExpiresAt: Date
}

export type CreateEnrollmentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    enrollment: Enrollment
  }
>

export class CreateEnrollmentUseCase {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute({
    userId,
    courseId,
    accessExpiresAt,
  }: CreateEnrollmentUseCaseRequest): Promise<CreateEnrollmentUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new ResourceNotFoundError('Usuário não encontrado.'))
    }

    const course = await this.coursesRepository.findById(courseId)
    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    const enrollment = await this.enrollmentsRepository.create({
      user_id: userId,
      course_id: courseId,
      access_expires_at: accessExpiresAt,
    })

    return right({ enrollment })
  }
}
