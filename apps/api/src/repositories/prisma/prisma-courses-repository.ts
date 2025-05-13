import type { Course, CourseStatus, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type {
  CourseRelations,
  CoursesRepository,
} from '../interfaces/courses-repository'

export class PrismaCoursesRepository implements CoursesRepository {
  async findById(id: string): Promise<CourseRelations['Basic'] | null> {
    return prisma.course.findUnique({
      where: { id },
    })
  }

  async findByIdWithInstructor(
    id: string,
  ): Promise<CourseRelations['WithInstructor'] | null> {
    return prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
      },
    })
  }

  async findByIdWithModules(
    id: string,
  ): Promise<CourseRelations['WithModules'] | null> {
    return prisma.course.findUnique({
      where: { id },
      include: {
        modules: true,
      },
    })
  }

  async findByIdWithEnrollments(
    id: string,
  ): Promise<CourseRelations['WithEnrollments'] | null> {
    return prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            user: true,
          },
        },
      },
    })
  }

  async findByIdWithMaterials(
    id: string,
  ): Promise<CourseRelations['WithMaterials'] | null> {
    return prisma.course.findUnique({
      where: { id },
      include: {
        materials: true,
      },
    })
  }

  async list({
    instructorId,
    status,
  }: { instructorId?: string; status?: CourseStatus } = {}): Promise<
    CourseRelations['Basic'][]
  > {
    const whereClause: Prisma.CourseWhereInput = {
      ...(instructorId ? { instructor_id: instructorId } : {}),
      ...(status ? { status } : {}),
    }

    return prisma.course.findMany({
      where: whereClause,
    })
  }

  async create(data: Prisma.CourseUncheckedCreateInput): Promise<Course> {
    return prisma.course.create({
      data,
    })
  }

  async save(data: Course): Promise<void> {
    await prisma.course.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.course.delete({
      where: { id },
    })
  }
}
