import type { Progress } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { LessonsRepository } from '@/repositories/interfaces/lessons-repository'
import type { ProgressesRepository } from '@/repositories/interfaces/progresses-repository'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface CreateProgressUseCaseRequest {
  userId: string
  lessonId: string
}

export type CreateProgressUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    progress: Progress
  }
>

export class CreateProgressUseCase {
  constructor(
    private readonly progressesRepository: ProgressesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly lessonsRepository: LessonsRepository,
  ) {}

  async execute({
    userId,
    lessonId,
  }: CreateProgressUseCaseRequest): Promise<CreateProgressUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      return left(new ResourceNotFoundError('Usuário não encontrado.'))
    }

    const lesson = await this.lessonsRepository.findById(lessonId)
    if (!lesson) {
      return left(new ResourceNotFoundError('Aula não encontrada.'))
    }

    const progress = await this.progressesRepository.create({
      user_id: userId,
      lesson_id: lessonId,
    })

    return right({ progress })
  }
}
