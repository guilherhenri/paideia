import type { Lesson } from '@prisma/client'

import { type Either, right } from '@/either'
import type { LessonsRepository } from '@/repositories/interfaces/lessons-repository'

interface ListLessonsUseCaseRequest {
  moduleId?: string
}

export type ListLessonsUseCaseResponse = Either<
  never,
  {
    lessons: Lesson[]
  }
>

export class ListLessonsUseCase {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async execute({
    moduleId,
  }: ListLessonsUseCaseRequest): Promise<ListLessonsUseCaseResponse> {
    const lessons = await this.lessonsRepository.list({ moduleId })

    return right({ lessons })
  }
}
