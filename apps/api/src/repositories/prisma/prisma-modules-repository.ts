import type { Module, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type {
  ModuleRelations,
  ModulesRepository,
} from '../interfaces/modules-repository'

export class PrismaModulesRepository implements ModulesRepository {
  async findById(id: string): Promise<ModuleRelations['Basic'] | null> {
    return prisma.module.findUnique({
      where: { id },
    })
  }

  async findByIdWithCourse(
    id: string,
  ): Promise<ModuleRelations['WithCourse'] | null> {
    return prisma.module.findUnique({
      where: { id },
      include: {
        course: true,
      },
    })
  }

  async findByIdWithLessons(
    id: string,
  ): Promise<ModuleRelations['WithLessons'] | null> {
    return prisma.module.findUnique({
      where: { id },
      include: {
        lessons: true,
      },
    })
  }

  async list({ courseId }: { courseId?: string } = {}): Promise<
    ModuleRelations['Basic'][]
  > {
    const whereClause: Prisma.ModuleWhereInput = courseId
      ? { course_id: courseId }
      : {}

    return prisma.module.findMany({
      where: whereClause,
    })
  }

  async create(data: Prisma.ModuleUncheckedCreateInput): Promise<Module> {
    return prisma.module.create({
      data,
    })
  }

  async save(data: Module): Promise<void> {
    await prisma.module.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.module.delete({
      where: { id },
    })
  }
}
