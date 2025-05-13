import type { Lesson, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import type {
  LessonRelations,
  LessonsRepository,
} from '../interfaces/lessons-repository'

export class InMemoryLessonsRepository implements LessonsRepository {
  public lessons: Lesson[] = []

  async findById(id: string): Promise<LessonRelations['Basic'] | null> {
    const lesson = this.lessons.find((lesson) => lesson.id === id)

    return lesson ?? null
  }

  async findByIdWithModule(
    id: string,
  ): Promise<LessonRelations['WithModule'] | null> {
    const lesson = this.lessons.find((lesson) => lesson.id === id)

    return (lesson as LessonRelations['WithModule']) ?? null
  }

  async findByIdWithProgress(
    id: string,
  ): Promise<LessonRelations['WithProgress'] | null> {
    const lesson = this.lessons.find((lesson) => lesson.id === id)

    return (lesson as LessonRelations['WithProgress']) ?? null
  }

  async list({ moduleId }: { moduleId?: string } = {}): Promise<
    LessonRelations['Basic'][]
  > {
    return this.lessons.filter((lesson) =>
      moduleId ? lesson.module_id === moduleId : true,
    )
  }

  async create(data: Prisma.LessonUncheckedCreateInput): Promise<Lesson> {
    const lesson: Lesson = {
      id: randomUUID(),
      module_id: data.module_id,
      title: data.title,
      description: data.description,
      provider_type: data.provider_type,
      provider_video_id: data.provider_video_id,
      comment: data.comment ?? null,
      order: data.order,
    }

    this.lessons.push(lesson)

    return lesson
  }

  async save(data: Lesson): Promise<void> {
    const lessonIndex = this.lessons.findIndex(
      (lesson) => lesson.id === data.id,
    )

    if (lessonIndex >= 0) {
      this.lessons[lessonIndex] = data
    }
  }

  async delete(id: string): Promise<void> {
    this.lessons = this.lessons.filter((lesson) => lesson.id !== id)
  }
}
