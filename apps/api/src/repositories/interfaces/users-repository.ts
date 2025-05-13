import { type Prisma, type Role, User } from '@prisma/client'

export type UserRelations = {
  Basic: User
  WithEnrolledCourses: Prisma.UserGetPayload<{
    include: {
      enrollments: {
        include: {
          course: true
        }
      }
    }
  }>
}

export interface UsersRepository {
  findById(id: string): Promise<UserRelations['Basic'] | null>
  findByEmail(email: string): Promise<UserRelations['Basic'] | null>
  findByIdWithEnrolledCourses(
    id: string,
  ): Promise<UserRelations['WithEnrolledCourses'] | null>

  list(params?: { role?: Role }): Promise<UserRelations['Basic'][]>

  create(data: Prisma.UserUncheckedCreateInput): Promise<User>
  save(data: User): Promise<User>
  delete(id: string): Promise<void>
}
