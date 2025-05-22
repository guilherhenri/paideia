import type { CourseMaterial } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CourseMaterialsRepository } from '@/repositories/interfaces/course-materials-repository'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'

interface CreateCourseMaterialUseCaseRequest {
  courseId: string
  title: string
  downloadUrl: string
}

export type CreateCourseMaterialUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseMaterial: CourseMaterial
  }
>

export class CreateCourseMaterialUseCase {
  constructor(
    private readonly courseMaterialsRepository: CourseMaterialsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute({
    courseId,
    title,
    downloadUrl,
  }: CreateCourseMaterialUseCaseRequest): Promise<CreateCourseMaterialUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)
    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    const courseMaterial = await this.courseMaterialsRepository.create({
      course_id: courseId,
      title,
      download_url: downloadUrl,
    })

    return right({ courseMaterial })
  }
}
