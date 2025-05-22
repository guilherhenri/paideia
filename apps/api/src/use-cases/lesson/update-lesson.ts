import type { Lesson, VideoProvider } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { LessonsRepository } from '@/repositories/interfaces/lessons-repository'
import type { ModulesRepository } from '@/repositories/interfaces/modules-repository'

interface UpdateLessonUseCaseRequest {
  id: string
  moduleId?: string
  title?: string
  description?: string
  providerType?: VideoProvider
  providerVideoId?: string
  order?: number
}

export type UpdateLessonUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    lesson: Lesson
  }
>

export class UpdateLessonUseCase {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly modulesRepository: ModulesRepository,
  ) {}

  async execute({
    id,
    moduleId,
    title,
    description,
    providerType,
    providerVideoId,
    order,
  }: UpdateLessonUseCaseRequest): Promise<UpdateLessonUseCaseResponse> {
    const lesson = await this.lessonsRepository.findById(id)

    if (!lesson) {
      return left(new ResourceNotFoundError('Aula não encontrada.'))
    }

    if (moduleId && moduleId !== lesson.module_id) {
      const module = await this.modulesRepository.findById(moduleId)
      if (!module) {
        return left(new ResourceNotFoundError('Módulo não encontrado.'))
      }
    }

    const updatedLesson: Lesson = {
      ...lesson,
      module_id: moduleId ?? lesson.module_id,
      title: title ?? lesson.title,
      description: description ?? lesson.description,
      provider_type: providerType ?? lesson.provider_type,
      provider_video_id: providerVideoId ?? lesson.provider_video_id,
      order: order ?? lesson.order,
    }

    await this.lessonsRepository.save(updatedLesson)

    return right({ lesson: updatedLesson })
  }
}
