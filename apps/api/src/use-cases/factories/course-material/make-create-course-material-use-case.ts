import { PrismaCourseMaterialsRepository } from '@/repositories/prisma/prisma-course-materials-repository'
import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { CreateCourseMaterialUseCase } from '@/use-cases/course-material/create-course-material'

export function makeCreateCourseMaterialUseCase() {
  const courseMaterialsRepository = new PrismaCourseMaterialsRepository()
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new CreateCourseMaterialUseCase(
    courseMaterialsRepository,
    coursesRepository,
  )

  return useCase
}
