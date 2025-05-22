import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateCourseUseCase } from '@/use-cases/course/create-course'

export function makeCreateCourseUseCase() {
  const coursesRepository = new PrismaCoursesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new CreateCourseUseCase(coursesRepository, usersRepository)

  return useCase
}
