import { PrismaModulesRepository } from '@/repositories/prisma/prisma-modules-repository'
import { FindModuleByIdUseCase } from '@/use-cases/module/find-module-by-id'

export function makeFindModuleByIdUseCase() {
  const modulesRepository = new PrismaModulesRepository()

  const useCase = new FindModuleByIdUseCase(modulesRepository)

  return useCase
}
