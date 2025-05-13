import type { Prisma, Progress } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type {
  ProgressesRepository,
  ProgressRelations,
} from '../interfaces/progresses-repository'

export class PrismaProgressesRepository implements ProgressesRepository {
  async findById(id: string): Promise<ProgressRelations['Basic'] | null> {
    return prisma.progress.findUnique({
      where: { id },
    })
  }

  async findByIdWithUser(
    id: string,
  ): Promise<ProgressRelations['WithUser'] | null> {
    return prisma.progress.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })
  }

  async findByIdWithLesson(
    id: string,
  ): Promise<ProgressRelations['WithLesson'] | null> {
    return prisma.progress.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    })
  }

  async list({
    userId,
    lessonId,
  }: { userId?: string; lessonId?: string } = {}): Promise<
    ProgressRelations['Basic'][]
  > {
    const whereClause: Prisma.ProgressWhereInput = {
      ...(userId ? { user_id: userId } : {}),
      ...(lessonId ? { lesson_id: lessonId } : {}),
    }

    return prisma.progress.findMany({
      where: whereClause,
    })
  }

  async create(data: Prisma.ProgressUncheckedCreateInput): Promise<Progress> {
    return prisma.progress.create({
      data,
    })
  }

  async save(data: Progress): Promise<void> {
    await prisma.progress.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.progress.delete({
      where: { id },
    })
  }
}
