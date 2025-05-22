import { PrismaModulesRepository } from '@/repositories/prisma/prisma-modules-repository'
import { FindModuleWithLessonsUseCase } from '@/use-cases/module/find-module-with-lessons'

export function makeFindModuleWithLessonsUseCase() {
  const modulesRepository = new PrismaModulesRepository()

  const useCase = new FindModuleWithLessonsUseCase(modulesRepository)

  return useCase
}
