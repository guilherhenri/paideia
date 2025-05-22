import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { PrismaModulesRepository } from '@/repositories/prisma/prisma-modules-repository'
import { UpdateLessonUseCase } from '@/use-cases/lesson/update-lesson'

export function makeUpdateLessonUseCase() {
  const lessonsRepository = new PrismaLessonsRepository()
  const modulesRepository = new PrismaModulesRepository()

  const useCase = new UpdateLessonUseCase(lessonsRepository, modulesRepository)

  return useCase
}
