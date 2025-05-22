import type { Enrollment } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'
import type { EnrollmentsRepository } from '@/repositories/interfaces/enrollments-repository'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface UpdateEnrollmentUseCaseRequest {
  id: string
  userId?: string
  courseId?: string
  accessExpiresAt?: Date
}

export type UpdateEnrollmentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    enrollment: Enrollment
  }
>

export class UpdateEnrollmentUseCase {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute({
    id,
    userId,
    courseId,
    accessExpiresAt,
  }: UpdateEnrollmentUseCaseRequest): Promise<UpdateEnrollmentUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findById(id)

    if (!enrollment) {
      return left(new ResourceNotFoundError('Matrícula não encontrada.'))
    }

    if (userId && userId !== enrollment.user_id) {
      const user = await this.usersRepository.findById(userId)
      if (!user) {
        return left(new ResourceNotFoundError('Usuário não encontrado.'))
      }
    }

    if (courseId && courseId !== enrollment.course_id) {
      const course = await this.coursesRepository.findById(courseId)
      if (!course) {
        return left(new ResourceNotFoundError('Curso não encontrado.'))
      }
    }

    const updatedEnrollment: Enrollment = {
      ...enrollment,
      user_id: userId ?? enrollment.user_id,
      course_id: courseId ?? enrollment.course_id,
      access_expires_at: accessExpiresAt ?? enrollment.access_expires_at,
      updated_at: new Date(),
    }

    await this.enrollmentsRepository.save(updatedEnrollment)

    return right({ enrollment: updatedEnrollment })
  }
}
