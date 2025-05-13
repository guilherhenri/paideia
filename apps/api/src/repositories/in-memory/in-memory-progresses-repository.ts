import type { Prisma, Progress } from '@prisma/client'
import { randomUUID } from 'crypto'

import type {
  ProgressesRepository,
  ProgressRelations,
} from '../interfaces/progresses-repository'

export class InMemoryProgressesRepository implements ProgressesRepository {
  public progresses: Progress[] = []

  async findById(id: string): Promise<ProgressRelations['Basic'] | null> {
    const progress = this.progresses.find((progress) => progress.id === id)

    return progress ?? null
  }

  async findByIdWithUser(
    id: string,
  ): Promise<ProgressRelations['WithUser'] | null> {
    const progress = this.progresses.find((progress) => progress.id === id)

    return (progress as ProgressRelations['WithUser']) ?? null
  }

  async findByIdWithLesson(
    id: string,
  ): Promise<ProgressRelations['WithLesson'] | null> {
    const progress = this.progresses.find((progress) => progress.id === id)

    return (progress as ProgressRelations['WithLesson']) ?? null
  }

  async list({
    userId,
    lessonId,
  }: { userId?: string; lessonId?: string } = {}): Promise<
    ProgressRelations['Basic'][]
  > {
    return this.progresses.filter(
      (progress) =>
        (userId ? progress.user_id === userId : true) &&
        (lessonId ? progress.lesson_id === lessonId : true),
    )
  }

  async create(data: Prisma.ProgressUncheckedCreateInput): Promise<Progress> {
    const progress: Progress = {
      id: randomUUID(),
      user_id: data.user_id,
      lesson_id: data.lesson_id,
      completed: data.completed ?? false,
      rating: data.rating ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.progresses.push(progress)

    return progress
  }

  async save(data: Progress): Promise<void> {
    const progressIndex = this.progresses.findIndex(
      (progress) => progress.id === data.id,
    )

    if (progressIndex >= 0) {
      this.progresses[progressIndex] = data
    }
  }

  async delete(id: string): Promise<void> {
    this.progresses = this.progresses.filter((progress) => progress.id !== id)
  }
}
