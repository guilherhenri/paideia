import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { PrismaModulesRepository } from '@/repositories/prisma/prisma-modules-repository'
import { CreateModuleUseCase } from '@/use-cases/module/create-module'

export function makeCreateModuleUseCase() {
  const modulesRepository = new PrismaModulesRepository()
  const coursesRepository = new PrismaCoursesRepository()

  const useCase = new CreateModuleUseCase(modulesRepository, coursesRepository)

  return useCase
}
