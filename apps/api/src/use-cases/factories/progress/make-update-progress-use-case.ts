import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { PrismaProgressesRepository } from '@/repositories/prisma/prisma-progresses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateProgressUseCase } from '@/use-cases/progress/update-progress'

export function makeUpdateProgressUseCase() {
  const progressesRepository = new PrismaProgressesRepository()
  const usersRepository = new PrismaUsersRepository()
  const lessonsRepository = new PrismaLessonsRepository()

  const useCase = new UpdateProgressUseCase(
    progressesRepository,
    usersRepository,
    lessonsRepository,
  )

  return useCase
}
