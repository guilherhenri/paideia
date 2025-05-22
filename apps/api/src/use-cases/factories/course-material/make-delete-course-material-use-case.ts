import { PrismaCourseMaterialsRepository } from '@/repositories/prisma/prisma-course-materials-repository'
import { DeleteCourseMaterialUseCase } from '@/use-cases/course-material/delete-course-material'

export function makeDeleteCourseMaterialUseCase() {
  const courseMaterialsRepository = new PrismaCourseMaterialsRepository()

  const useCase = new DeleteCourseMaterialUseCase(courseMaterialsRepository)

  return useCase
}
