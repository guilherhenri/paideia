import type { Module, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import type {
  ModuleRelations,
  ModulesRepository,
} from '../interfaces/modules-repository'

export class InMemoryModulesRepository implements ModulesRepository {
  public modules: Module[] = []

  async findById(id: string): Promise<ModuleRelations['Basic'] | null> {
    const module = this.modules.find((module) => module.id === id)

    return module ?? null
  }

  async findByIdWithCourse(
    id: string,
  ): Promise<ModuleRelations['WithCourse'] | null> {
    const module = this.modules.find((module) => module.id === id)

    return (module as ModuleRelations['WithCourse']) ?? null
  }

  async findByIdWithLessons(
    id: string,
  ): Promise<ModuleRelations['WithLessons'] | null> {
    const module = this.modules.find((module) => module.id === id)

    return (module as ModuleRelations['WithLessons']) ?? null
  }

  async list({ courseId }: { courseId?: string } = {}): Promise<
    ModuleRelations['Basic'][]
  > {
    return this.modules.filter((module) =>
      courseId ? module.course_id === courseId : true,
    )
  }

  async create(data: Prisma.ModuleUncheckedCreateInput): Promise<Module> {
    const module: Module = {
      id: randomUUID(),
      course_id: data.course_id,
      title: data.title,
      description: data.description,
      order: data.order,
    }

    this.modules.push(module)

    return module
  }

  async save(data: Module): Promise<void> {
    const moduleIndex = this.modules.findIndex(
      (module) => module.id === data.id,
    )

    if (moduleIndex >= 0) {
      this.modules[moduleIndex] = data
    }
  }

  async delete(id: string): Promise<void> {
    this.modules = this.modules.filter((module) => module.id !== id)
  }
}
