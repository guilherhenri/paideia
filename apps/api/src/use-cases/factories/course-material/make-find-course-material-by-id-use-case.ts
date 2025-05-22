import { PrismaCourseMaterialsRepository } from '@/repositories/prisma/prisma-course-materials-repository'
import { FindCourseMaterialByIdUseCase } from '@/use-cases/course-material/find-course-material-by-id'

export function makeFindCourseMaterialByIdUseCase() {
  const courseMaterialsRepository = new PrismaCourseMaterialsRepository()

  const useCase = new FindCourseMaterialByIdUseCase(courseMaterialsRepository)

  return useCase
}
