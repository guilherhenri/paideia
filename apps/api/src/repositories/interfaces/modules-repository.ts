import { type Module, type Prisma } from '@prisma/client'

export type ModuleRelations = {
  Basic: Module
  WithCourse: Prisma.ModuleGetPayload<{
    include: {
      course: true
    }
  }>
  WithLessons: Prisma.ModuleGetPayload<{
    include: {
      lessons: true
    }
  }>
}

export interface ModulesRepository {
  findById(id: string): Promise<ModuleRelations['Basic'] | null>
  findByIdWithCourse(id: string): Promise<ModuleRelations['WithCourse'] | null>
  findByIdWithLessons(
    id: string,
  ): Promise<ModuleRelations['WithLessons'] | null>

  list(params?: { courseId?: string }): Promise<ModuleRelations['Basic'][]>

  create(data: Prisma.ModuleUncheckedCreateInput): Promise<Module>
  save(data: Module): Promise<Module>
  delete(id: string): Promise<void>
}
