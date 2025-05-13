import type { Prisma, Role, User } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type {
  UserRelations,
  UsersRepository,
} from '../interfaces/users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<UserRelations['Basic'] | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string): Promise<UserRelations['Basic'] | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async findByIdWithEnrolledCourses(
    id: string,
  ): Promise<UserRelations['WithEnrolledCourses'] | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    })
  }

  async list({ role }: { role?: Role }): Promise<UserRelations['Basic'][]> {
    const whereClause: Prisma.UserWhereInput = role ? { role } : {}

    return prisma.user.findMany({
      where: whereClause,
    })
  }

  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    })
  }

  async save(data: User): Promise<void> {
    await prisma.user.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    })
  }
}
