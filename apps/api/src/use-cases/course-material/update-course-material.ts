import type { CourseMaterial } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CourseMaterialsRepository } from '@/repositories/interfaces/course-materials-repository'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'

interface UpdateCourseMaterialUseCaseRequest {
  id: string
  courseId?: string
  title?: string
  downloadUrl?: string
}

export type UpdateCourseMaterialUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseMaterial: CourseMaterial
  }
>

export class UpdateCourseMaterialUseCase {
  constructor(
    private readonly courseMaterialsRepository: CourseMaterialsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute({
    id,
    courseId,
    title,
    downloadUrl,
  }: UpdateCourseMaterialUseCaseRequest): Promise<UpdateCourseMaterialUseCaseResponse> {
    const courseMaterial = await this.courseMaterialsRepository.findById(id)

    if (!courseMaterial) {
      return left(
        new ResourceNotFoundError('Material do curso não encontrado.'),
      )
    }

    if (courseId && courseId !== courseMaterial.course_id) {
      const course = await this.coursesRepository.findById(courseId)
      if (!course) {
        return left(new ResourceNotFoundError('Curso não encontrado.'))
      }
    }

    const updatedCourseMaterial: CourseMaterial = {
      ...courseMaterial,
      course_id: courseId ?? courseMaterial.course_id,
      title: title ?? courseMaterial.title,
      download_url: downloadUrl ?? courseMaterial.download_url,
    }

    await this.courseMaterialsRepository.save(updatedCourseMaterial)

    return right({ courseMaterial: updatedCourseMaterial })
  }
}
