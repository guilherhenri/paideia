import { PrismaModulesRepository } from '@/repositories/prisma/prisma-modules-repository'
import { ListModulesUseCase } from '@/use-cases/module/list-modules'

export function makeListModulesUseCase() {
  const modulesRepository = new PrismaModulesRepository()

  const useCase = new ListModulesUseCase(modulesRepository)

  return useCase
}
