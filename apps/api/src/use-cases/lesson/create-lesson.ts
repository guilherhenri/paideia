import type { Lesson, VideoProvider } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { LessonsRepository } from '@/repositories/interfaces/lessons-repository'
import type { ModulesRepository } from '@/repositories/interfaces/modules-repository'

interface CreateLessonUseCaseRequest {
  moduleId: string
  title: string
  description: string
  providerType: VideoProvider
  providerVideoId: string
  order: number
}

export type CreateLessonUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    lesson: Lesson
  }
>

export class CreateLessonUseCase {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly modulesRepository: ModulesRepository,
  ) {}

  async execute({
    moduleId,
    title,
    description,
    providerType,
    providerVideoId,
    order,
  }: CreateLessonUseCaseRequest): Promise<CreateLessonUseCaseResponse> {
    const module = await this.modulesRepository.findById(moduleId)

    if (!module) {
      return left(new ResourceNotFoundError('Módulo não encontrado.'))
    }

    const lesson = await this.lessonsRepository.create({
      module_id: moduleId,
      title,
      description,
      provider_type: providerType,
      provider_video_id: providerVideoId,
      order,
    })

    return right({ lesson })
  }
}
