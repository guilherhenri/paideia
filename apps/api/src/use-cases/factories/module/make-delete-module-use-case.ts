import { PrismaModulesRepository } from '@/repositories/prisma/prisma-modules-repository'
import { DeleteModuleUseCase } from '@/use-cases/module/delete-module'

export function makeDeleteModuleUseCase() {
  const modulesRepository = new PrismaModulesRepository()

  const useCase = new DeleteModuleUseCase(modulesRepository)

  return useCase
}
