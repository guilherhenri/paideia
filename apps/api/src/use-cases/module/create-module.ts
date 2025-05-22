import type { Module } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'
import type { ModulesRepository } from '@/repositories/interfaces/modules-repository'

interface CreateModuleUseCaseRequest {
  courseId: string
  title: string
  description: string
  order: number
}

export type CreateModuleUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    module: Module
  }
>

export class CreateModuleUseCase {
  constructor(
    private readonly modulesRepository: ModulesRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute({
    courseId,
    title,
    description,
    order,
  }: CreateModuleUseCaseRequest): Promise<CreateModuleUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId)

    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    const module = await this.modulesRepository.create({
      course_id: courseId,
      title,
      description,
      order,
    })

    return right({ module })
  }
}
