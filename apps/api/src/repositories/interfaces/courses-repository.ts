import { type Course, type CourseStatus, type Prisma } from '@prisma/client'

export type CourseRelations = {
  Basic: Course
  WithInstructor: Prisma.CourseGetPayload<{
    include: {
      instructor: true
    }
  }>
  WithModules: Prisma.CourseGetPayload<{
    include: {
      modules: true
    }
  }>
  WithEnrollments: Prisma.CourseGetPayload<{
    include: {
      enrollments: {
        include: {
          user: true
        }
      }
    }
  }>
  WithMaterials: Prisma.CourseGetPayload<{
    include: {
      materials: true
    }
  }>
}

export interface CoursesRepository {
  findById(id: string): Promise<CourseRelations['Basic'] | null>
  findByIdWithInstructor(
    id: string,
  ): Promise<CourseRelations['WithInstructor'] | null>
  findByIdWithModules(
    id: string,
  ): Promise<CourseRelations['WithModules'] | null>
  findByIdWithEnrollments(
    id: string,
  ): Promise<CourseRelations['WithEnrollments'] | null>
  findByIdWithMaterials(
    id: string,
  ): Promise<CourseRelations['WithMaterials'] | null>

  list(params?: {
    instructorId?: string
    status?: CourseStatus
  }): Promise<CourseRelations['Basic'][]>

  create(data: Prisma.CourseUncheckedCreateInput): Promise<Course>
  save(data: Course): Promise<void>
  delete(id: string): Promise<void>
}
