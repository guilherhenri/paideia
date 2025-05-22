import type { Course, CourseStatus } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface UpdateCourseUseCaseRequest {
  id: string
  title?: string
  description?: string
  category?: string
  logoImage?: string
  accessDurationMonths?: number
  instructorId?: string
  status?: CourseStatus
}

export type UpdateCourseUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    course: Course
  }
>

export class UpdateCourseUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    id,
    title,
    description,
    category,
    logoImage,
    accessDurationMonths,
    instructorId,
    status,
  }: UpdateCourseUseCaseRequest): Promise<UpdateCourseUseCaseResponse> {
    const course = await this.coursesRepository.findById(id)

    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    if (instructorId && instructorId !== course.instructor_id) {
      const instructor = await this.usersRepository.findById(instructorId)

      if (!instructor) {
        return left(new ResourceNotFoundError('Instrutor não encontrado.'))
      }
    }

    const updatedCourse: Course = {
      ...course,
      title: title ?? course.title,
      description: description ?? course.description,
      category: category ?? course.category,
      logo_image: logoImage ?? course.logo_image,
      access_duration_months:
        accessDurationMonths ?? course.access_duration_months,
      instructor_id: instructorId ?? course.instructor_id,
      status: status ?? course.status,
      updated_at: new Date(),
    }

    await this.coursesRepository.save(updatedCourse)

    return right({ course: updatedCourse })
  }
}
