import type { Course, CourseStatus } from '@prisma/client'

import { type Either, right } from '@/either'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'

interface ListCoursesUseCaseRequest {
  instructorId?: string
  status?: CourseStatus
}

export type ListCoursesUseCaseResponse = Either<
  never,
  {
    courses: Course[]
  }
>

export class ListCoursesUseCase {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute({
    instructorId,
    status,
  }: ListCoursesUseCaseRequest): Promise<ListCoursesUseCaseResponse> {
    const courses = await this.coursesRepository.list({ instructorId, status })

    return right({ courses })
  }
}
