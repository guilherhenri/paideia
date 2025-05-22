import type { Module } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'
import type { ModulesRepository } from '@/repositories/interfaces/modules-repository'

interface UpdateModuleUseCaseRequest {
  id: string
  courseId?: string
  title?: string
  description?: string
  order?: number
}

export type UpdateModuleUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    module: Module
  }
>

export class UpdateModuleUseCase {
  constructor(
    private readonly modulesRepository: ModulesRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async execute({
    id,
    courseId,
    title,
    description,
    order,
  }: UpdateModuleUseCaseRequest): Promise<UpdateModuleUseCaseResponse> {
    const module = await this.modulesRepository.findById(id)

    if (!module) {
      return left(new ResourceNotFoundError('Módulo não encontrado.'))
    }

    if (courseId && courseId !== module.course_id) {
      const course = await this.coursesRepository.findById(courseId)
      if (!course) {
        return left(new ResourceNotFoundError('Curso não encontrado.'))
      }
    }

    const updatedModule: Module = {
      ...module,
      course_id: courseId ?? module.course_id,
      title: title ?? module.title,
      description: description ?? module.description,
      order: order ?? module.order,
    }

    await this.modulesRepository.save(updatedModule)

    return right({ module: updatedModule })
  }
}
