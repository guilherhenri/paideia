import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { PrismaProgressesRepository } from '@/repositories/prisma/prisma-progresses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateProgressUseCase } from '@/use-cases/progress/create-progress'

export function makeCreateProgressUseCase() {
  const progressesRepository = new PrismaProgressesRepository()
  const usersRepository = new PrismaUsersRepository()
  const lessonsRepository = new PrismaLessonsRepository()

  const useCase = new CreateProgressUseCase(
    progressesRepository,
    usersRepository,
    lessonsRepository,
  )

  return useCase
}
