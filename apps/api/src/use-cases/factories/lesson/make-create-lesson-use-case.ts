import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { PrismaModulesRepository } from '@/repositories/prisma/prisma-modules-repository'
import { CreateLessonUseCase } from '@/use-cases/lesson/create-lesson'

export function makeCreateLessonUseCase() {
  const lessonsRepository = new PrismaLessonsRepository()
  const modulesRepository = new PrismaModulesRepository()

  const useCase = new CreateLessonUseCase(lessonsRepository, modulesRepository)

  return useCase
}
