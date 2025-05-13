import type { Lesson, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type {
  LessonRelations,
  LessonsRepository,
} from '../interfaces/lessons-repository'

export class PrismaLessonsRepository implements LessonsRepository {
  async findById(id: string): Promise<LessonRelations['Basic'] | null> {
    return prisma.lesson.findUnique({
      where: { id },
    })
  }

  async findByIdWithModule(
    id: string,
  ): Promise<LessonRelations['WithModule'] | null> {
    return prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    })
  }

  async findByIdWithProgress(
    id: string,
  ): Promise<LessonRelations['WithProgress'] | null> {
    return prisma.lesson.findUnique({
      where: { id },
      include: {
        progress: true,
      },
    })
  }

  async list({ moduleId }: { moduleId?: string } = {}): Promise<
    LessonRelations['Basic'][]
  > {
    const whereClause: Prisma.LessonWhereInput = moduleId
      ? { module_id: moduleId }
      : {}

    return prisma.lesson.findMany({
      where: whereClause,
    })
  }

  async create(data: Prisma.LessonUncheckedCreateInput): Promise<Lesson> {
    return prisma.lesson.create({
      data,
    })
  }

  async save(data: Lesson): Promise<void> {
    await prisma.lesson.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.lesson.delete({
      where: { id },
    })
  }
}
