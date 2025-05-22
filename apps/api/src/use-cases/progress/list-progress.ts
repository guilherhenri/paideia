import type { Progress } from '@prisma/client'

import { type Either, right } from '@/either'
import type { ProgressesRepository } from '@/repositories/interfaces/progresses-repository'

interface ListProgressUseCaseRequest {
  userId?: string
  lessonId?: string
}

export type ListProgressUseCaseResponse = Either<
  never,
  {
    progresses: Progress[]
  }
>

export class ListProgressUseCase {
  constructor(private readonly progressesRepository: ProgressesRepository) {}

  async execute({
    userId,
    lessonId,
  }: ListProgressUseCaseRequest): Promise<ListProgressUseCaseResponse> {
    const progresses = await this.progressesRepository.list({
      userId,
      lessonId,
    })

    return right({ progresses })
  }
}
