import type { Course } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'

interface FindCourseByIdUseCaseRequest {
  id: string
}

export type FindCourseByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    course: Course
  }
>

export class FindCourseByIdUseCase {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute({
    id,
  }: FindCourseByIdUseCaseRequest): Promise<FindCourseByIdUseCaseResponse> {
    const course = await this.coursesRepository.findById(id)

    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    return right({ course })
  }
}
