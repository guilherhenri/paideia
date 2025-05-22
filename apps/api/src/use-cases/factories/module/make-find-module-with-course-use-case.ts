import { PrismaModulesRepository } from '@/repositories/prisma/prisma-modules-repository'
import { FindModuleWithCourseUseCase } from '@/use-cases/module/find-module-with-course'

export function makeFindModuleWithCourseUseCase() {
  const modulesRepository = new PrismaModulesRepository()

  const useCase = new FindModuleWithCourseUseCase(modulesRepository)

  return useCase
}
