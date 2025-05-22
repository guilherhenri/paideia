import type { Lesson } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { LessonsRepository } from '@/repositories/interfaces/lessons-repository'

interface FindLessonByIdUseCaseRequest {
  id: string
}

export type FindLessonByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    lesson: Lesson
  }
>

export class FindLessonByIdUseCase {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async execute({
    id,
  }: FindLessonByIdUseCaseRequest): Promise<FindLessonByIdUseCaseResponse> {
    const lesson = await this.lessonsRepository.findById(id)

    if (!lesson) {
      return left(new ResourceNotFoundError('Aula não encontrada.'))
    }

    return right({ lesson })
  }
}
