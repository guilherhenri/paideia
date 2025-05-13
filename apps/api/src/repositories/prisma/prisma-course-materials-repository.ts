import type { CourseMaterial, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type {
  CourseMaterialRelations,
  CourseMaterialsRepository,
} from '../interfaces/course-materials-repository'

export class PrismaCourseMaterialsRepository
  implements CourseMaterialsRepository
{
  async findById(id: string): Promise<CourseMaterialRelations['Basic'] | null> {
    return prisma.courseMaterial.findUnique({
      where: { id },
    })
  }

  async findByIdWithCourse(
    id: string,
  ): Promise<CourseMaterialRelations['WithCourse'] | null> {
    return prisma.courseMaterial.findUnique({
      where: { id },
      include: {
        course: true,
      },
    })
  }

  async list({ courseId }: { courseId?: string } = {}): Promise<
    CourseMaterialRelations['Basic'][]
  > {
    const whereClause: Prisma.CourseMaterialWhereInput = courseId
      ? { course_id: courseId }
      : {}

    return prisma.courseMaterial.findMany({
      where: whereClause,
    })
  }

  async create(
    data: Prisma.CourseMaterialUncheckedCreateInput,
  ): Promise<CourseMaterial> {
    return prisma.courseMaterial.create({
      data,
    })
  }

  async save(data: CourseMaterial): Promise<void> {
    await prisma.courseMaterial.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.courseMaterial.delete({
      where: { id },
    })
  }
}
