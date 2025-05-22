import { PrismaCourseMaterialsRepository } from '@/repositories/prisma/prisma-course-materials-repository'
import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { UpdateCourseMaterialUseCase } from '@/use-cases/course-material/update-course-material'

export function makeUpdateCourseMaterialUseCase() {
  const courseMaterialsRepository = new PrismaCourseMaterialsRepository()
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new UpdateCourseMaterialUseCase(
    courseMaterialsRepository,
    coursesRepository,
  )

  return useCase
}
