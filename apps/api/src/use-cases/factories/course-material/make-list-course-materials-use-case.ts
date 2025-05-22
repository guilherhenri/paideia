import { PrismaCourseMaterialsRepository } from '@/repositories/prisma/prisma-course-materials-repository'
import { ListCourseMaterialsUseCase } from '@/use-cases/course-material/list-course-materials'

export function makeListCourseMaterialsUseCase() {
  const courseMaterialsRepository = new PrismaCourseMaterialsRepository()

  const useCase = new ListCourseMaterialsUseCase(courseMaterialsRepository)

  return useCase
}
