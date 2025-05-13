import type { Course, CourseStatus, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import type {
  CourseRelations,
  CoursesRepository,
} from '../interfaces/courses-repository'

export class InMemoryCoursesRepository implements CoursesRepository {
  public courses: Course[] = []

  async findById(id: string): Promise<CourseRelations['Basic'] | null> {
    const course = this.courses.find((course) => course.id === id)

    return course ?? null
  }

  async findByIdWithInstructor(
    id: string,
  ): Promise<CourseRelations['WithInstructor'] | null> {
    const course = this.courses.find((course) => course.id === id)

    return (course as CourseRelations['WithInstructor']) ?? null
  }

  async findByIdWithModules(
    id: string,
  ): Promise<CourseRelations['WithModules'] | null> {
    const course = this.courses.find((course) => course.id === id)
    return (course as CourseRelations['WithModules']) ?? null
  }

  async findByIdWithEnrollments(
    id: string,
  ): Promise<CourseRelations['WithEnrollments'] | null> {
    const course = this.courses.find((course) => course.id === id)

    return (course as CourseRelations['WithEnrollments']) ?? null
  }

  async findByIdWithMaterials(
    id: string,
  ): Promise<CourseRelations['WithMaterials'] | null> {
    const course = this.courses.find((course) => course.id === id)

    return (course as CourseRelations['WithMaterials']) ?? null
  }

  async list({
    instructorId,
    status,
  }: { instructorId?: string; status?: CourseStatus } = {}): Promise<
    CourseRelations['Basic'][]
  > {
    return this.courses.filter(
      (course) =>
        (instructorId ? course.instructor_id === instructorId : true) &&
        (status ? course.status === status : true),
    )
  }

  async create(data: Prisma.CourseUncheckedCreateInput): Promise<Course> {
    const course: Course = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      category: data.category,
      logo_image: data.logo_image,
      access_duration_months: data.access_duration_months,
      instructor_id: data.instructor_id,
      status: data.status ?? 'draft',
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.courses.push(course)

    return course
  }

  async save(data: Course): Promise<void> {
    const courseIndex = this.courses.findIndex(
      (course) => course.id === data.id,
    )
    if (courseIndex >= 0) {
      this.courses[courseIndex] = data
    }
  }

  async delete(id: string): Promise<void> {
    this.courses = this.courses.filter((course) => course.id !== id)
  }
}
