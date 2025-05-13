import { type CourseMaterial, type Prisma } from '@prisma/client'

export type CourseMaterialRelations = {
  Basic: CourseMaterial
  WithCourse: Prisma.CourseMaterialGetPayload<{
    include: {
      course: true
    }
  }>
}

export interface CourseMaterialsRepository {
  findById(id: string): Promise<CourseMaterialRelations['Basic'] | null>
  findByIdWithCourse(
    id: string,
  ): Promise<CourseMaterialRelations['WithCourse'] | null>

  list(params?: {
    courseId?: string
  }): Promise<CourseMaterialRelations['Basic'][]>

  create(
    data: Prisma.CourseMaterialUncheckedCreateInput,
  ): Promise<CourseMaterial>
  save(data: CourseMaterial): Promise<CourseMaterial>
  delete(id: string): Promise<void>
}
