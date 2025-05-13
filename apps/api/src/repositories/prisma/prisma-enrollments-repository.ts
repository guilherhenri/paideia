import type { Enrollment, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type {
  EnrollmentRelations,
  EnrollmentsRepository,
} from '../interfaces/enrollments-repository'

export class PrismaEnrollmentsRepository implements EnrollmentsRepository {
  async findById(id: string): Promise<EnrollmentRelations['Basic'] | null> {
    return prisma.enrollment.findUnique({
      where: { id },
    })
  }

  async findByIdWithUser(
    id: string,
  ): Promise<EnrollmentRelations['WithUser'] | null> {
    return prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })
  }

  async findByIdWithCourse(
    id: string,
  ): Promise<EnrollmentRelations['WithCourse'] | null> {
    return prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: true,
      },
    })
  }

  async list({
    userId,
    courseId,
  }: { userId?: string; courseId?: string } = {}): Promise<
    EnrollmentRelations['Basic'][]
  > {
    const whereClause: Prisma.EnrollmentWhereInput = {
      ...(userId ? { user_id: userId } : {}),
      ...(courseId ? { course_id: courseId } : {}),
    }

    return prisma.enrollment.findMany({
      where: whereClause,
    })
  }

  async create(
    data: Prisma.EnrollmentUncheckedCreateInput,
  ): Promise<Enrollment> {
    return prisma.enrollment.create({
      data,
    })
  }

  async save(data: Enrollment): Promise<void> {
    await prisma.enrollment.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.enrollment.delete({
      where: { id },
    })
  }
}
