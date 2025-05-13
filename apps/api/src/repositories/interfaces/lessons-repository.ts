import { type Lesson, type Prisma } from '@prisma/client'

export type LessonRelations = {
  Basic: Lesson
  WithModule: Prisma.LessonGetPayload<{
    include: {
      module: {
        include: {
          course: true
        }
      }
    }
  }>
  WithProgress: Prisma.LessonGetPayload<{
    include: {
      progress: true
    }
  }>
}

export interface LessonsRepository {
  findById(id: string): Promise<LessonRelations['Basic'] | null>
  findByIdWithModule(id: string): Promise<LessonRelations['WithModule'] | null>
  findByIdWithProgress(
    id: string,
  ): Promise<LessonRelations['WithProgress'] | null>

  list(params?: { moduleId?: string }): Promise<LessonRelations['Basic'][]>

  create(data: Prisma.LessonUncheckedCreateInput): Promise<Lesson>
  save(data: Lesson): Promise<void>
  delete(id: string): Promise<void>
}
