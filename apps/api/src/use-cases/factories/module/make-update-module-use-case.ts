import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { PrismaModulesRepository } from '@/repositories/prisma/prisma-modules-repository'
import { UpdateModuleUseCase } from '@/use-cases/module/update-module'

export function makeUpdateModuleUseCase() {
  const modulesRepository = new PrismaModulesRepository()
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new UpdateModuleUseCase(modulesRepository, coursesRepository)

  return useCase
}
