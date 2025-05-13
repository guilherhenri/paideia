import { type Prisma, type Progress } from '@prisma/client'

export type ProgressRelations = {
  Basic: Progress
  WithUser: Prisma.ProgressGetPayload<{
    include: {
      user: true
    }
  }>
  WithLesson: Prisma.ProgressGetPayload<{
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: true
            }
          }
        }
      }
    }
  }>
}

export interface ProgressesRepository {
  findById(id: string): Promise<ProgressRelations['Basic'] | null>
  findByIdWithUser(id: string): Promise<ProgressRelations['WithUser'] | null>
  findByIdWithLesson(
    id: string,
  ): Promise<ProgressRelations['WithLesson'] | null>

  list(params?: {
    userId?: string
    lessonId?: string
  }): Promise<ProgressRelations['Basic'][]>

  create(data: Prisma.ProgressUncheckedCreateInput): Promise<Progress>
  save(data: Progress): Promise<void>
  delete(id: string): Promise<void>
}
