import type { Progress } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { LessonsRepository } from '@/repositories/interfaces/lessons-repository'
import type { ProgressesRepository } from '@/repositories/interfaces/progresses-repository'
import type { UsersRepository } from '@/repositories/interfaces/users-repository'

interface UpdateProgressUseCaseRequest {
  id: string
  userId?: string
  lessonId?: string
}

export type UpdateProgressUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    progress: Progress
  }
>

export class UpdateProgressUseCase {
  constructor(
    private readonly progressesRepository: ProgressesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly lessonsRepository: LessonsRepository,
  ) {}

  async execute({
    id,
    userId,
    lessonId,
  }: UpdateProgressUseCaseRequest): Promise<UpdateProgressUseCaseResponse> {
    const progress = await this.progressesRepository.findById(id)

    if (!progress) {
      return left(new ResourceNotFoundError('Progresso não encontrado.'))
    }

    if (userId && userId !== progress.user_id) {
      const user = await this.usersRepository.findById(userId)
      if (!user) {
        return left(new ResourceNotFoundError('Usuário não encontrado.'))
      }
    }

    if (lessonId && lessonId !== progress.lesson_id) {
      const lesson = await this.lessonsRepository.findById(lessonId)
      if (!lesson) {
        return left(new ResourceNotFoundError('Aula não encontrada.'))
      }
    }

    const updatedProgress: Progress = {
      ...progress,
      user_id: userId ?? progress.user_id,
      lesson_id: lessonId ?? progress.lesson_id,
      updated_at: new Date(),
    }

    await this.progressesRepository.save(updatedProgress)

    return right({ progress: updatedProgress })
  }
}
