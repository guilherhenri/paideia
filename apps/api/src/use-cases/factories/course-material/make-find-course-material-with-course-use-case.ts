import { PrismaCourseMaterialsRepository } from '@/repositories/prisma/prisma-course-materials-repository'
import { FindCourseMaterialWithCourseUseCase } from '@/use-cases/course-material/find-course-material-with-course'

export function makeFindCourseMaterialWithCourseUseCase() {
  const courseMaterialsRepository = new PrismaCourseMaterialsRepository()

  const useCase = new FindCourseMaterialWithCourseUseCase(
    courseMaterialsRepository,
  )

  return useCase
}
