import type { Course } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface CreateCourseUseCaseRequest {
  title: string
  description: string
  category: string
  logoImage: string
  accessDurationMonths: number
  instructorId: string
}

export type CreateCourseUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    course: Course
  }
>

export class CreateCourseUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    title,
    description,
    category,
    logoImage,
    accessDurationMonths,
    instructorId,
  }: CreateCourseUseCaseRequest): Promise<CreateCourseUseCaseResponse> {
    const instructor = await this.usersRepository.findById(instructorId)

    if (!instructor) {
      return left(new ResourceNotFoundError('Instrutor não encontrado.'))
    }

    const course = await this.coursesRepository.create({
      title,
      description,
      category,
      logo_image: logoImage,
      access_duration_months: accessDurationMonths,
      instructor_id: instructorId,
    })

    return right({ course })
  }
}
