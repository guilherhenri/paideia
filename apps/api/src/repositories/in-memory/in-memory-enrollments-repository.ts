import type { Enrollment, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import type {
  EnrollmentRelations,
  EnrollmentsRepository,
} from '../interfaces/enrollments-repository'

export class InMemoryEnrollmentsRepository implements EnrollmentsRepository {
  public enrollments: Enrollment[] = []

  async findById(id: string): Promise<EnrollmentRelations['Basic'] | null> {
    const enrollment = this.enrollments.find(
      (enrollment) => enrollment.id === id,
    )

    return enrollment ?? null
  }

  async findByIdWithUser(
    id: string,
  ): Promise<EnrollmentRelations['WithUser'] | null> {
    const enrollment = this.enrollments.find(
      (enrollment) => enrollment.id === id,
    )

    return (enrollment as EnrollmentRelations['WithUser']) ?? null
  }

  async findByIdWithCourse(
    id: string,
  ): Promise<EnrollmentRelations['WithCourse'] | null> {
    const enrollment = this.enrollments.find(
      (enrollment) => enrollment.id === id,
    )

    return (enrollment as EnrollmentRelations['WithCourse']) ?? null
  }

  async list({
    userId,
    courseId,
  }: { userId?: string; courseId?: string } = {}): Promise<
    EnrollmentRelations['Basic'][]
  > {
    return this.enrollments.filter(
      (enrollment) =>
        (userId ? enrollment.user_id === userId : true) &&
        (courseId ? enrollment.course_id === courseId : true),
    )
  }

  async create(
    data: Prisma.EnrollmentUncheckedCreateInput,
  ): Promise<Enrollment> {
    const enrollment: Enrollment = {
      id: randomUUID(),
      user_id: data.user_id,
      course_id: data.course_id,
      access_expires_at: new Date(data.access_expires_at),
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.enrollments.push(enrollment)

    return enrollment
  }

  async save(data: Enrollment): Promise<void> {
    const enrollmentIndex = this.enrollments.findIndex(
      (enrollment) => enrollment.id === data.id,
    )

    if (enrollmentIndex >= 0) {
      this.enrollments[enrollmentIndex] = data
    }
  }

  async delete(id: string): Promise<void> {
    this.enrollments = this.enrollments.filter(
      (enrollment) => enrollment.id !== id,
    )
  }
}
