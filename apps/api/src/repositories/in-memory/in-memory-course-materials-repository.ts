import type { CourseMaterial, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import type {
  CourseMaterialRelations,
  CourseMaterialsRepository,
} from '../interfaces/course-materials-repository'

export class InMemoryCourseMaterialsRepository
  implements CourseMaterialsRepository
{
  public materials: CourseMaterial[] = []

  async findById(id: string): Promise<CourseMaterialRelations['Basic'] | null> {
    const material = this.materials.find((material) => material.id === id)

    return material ?? null
  }

  async findByIdWithCourse(
    id: string,
  ): Promise<CourseMaterialRelations['WithCourse'] | null> {
    const material = this.materials.find((material) => material.id === id)

    return (material as CourseMaterialRelations['WithCourse']) ?? null
  }

  async list({ courseId }: { courseId?: string } = {}): Promise<
    CourseMaterialRelations['Basic'][]
  > {
    return this.materials.filter((material) =>
      courseId ? material.course_id === courseId : true,
    )
  }

  async create(
    data: Prisma.CourseMaterialUncheckedCreateInput,
  ): Promise<CourseMaterial> {
    const material: CourseMaterial = {
      id: randomUUID(),
      course_id: data.course_id,
      title: data.title,
      download_url: data.download_url,
    }

    this.materials.push(material)

    return material
  }

  async save(data: CourseMaterial): Promise<void> {
    const materialIndex = this.materials.findIndex(
      (material) => material.id === data.id,
    )

    if (materialIndex >= 0) {
      this.materials[materialIndex] = data
    }
  }

  async delete(id: string): Promise<void> {
    this.materials = this.materials.filter((material) => material.id !== id)
  }
}
