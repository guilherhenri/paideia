import { type Enrollment, type Prisma } from '@prisma/client'

export type EnrollmentRelations = {
  Basic: Enrollment
  WithUser: Prisma.EnrollmentGetPayload<{
    include: {
      user: true
    }
  }>
  WithCourse: Prisma.EnrollmentGetPayload<{
    include: {
      course: true
    }
  }>
}

export interface EnrollmentsRepository {
  findById(id: string): Promise<EnrollmentRelations['Basic'] | null>
  findByIdWithUser(id: string): Promise<EnrollmentRelations['WithUser'] | null>
  findByIdWithCourse(
    id: string,
  ): Promise<EnrollmentRelations['WithCourse'] | null>

  list(params?: {
    userId?: string
    courseId?: string
  }): Promise<EnrollmentRelations['Basic'][]>

  create(data: Prisma.EnrollmentUncheckedCreateInput): Promise<Enrollment>
  save(data: Enrollment): Promise<void>
  delete(id: string): Promise<void>
}
