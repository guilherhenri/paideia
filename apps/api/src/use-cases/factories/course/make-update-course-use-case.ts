import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-courses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateCourseUseCase } from '@/use-cases/course/update-course'

export function makeUpdateCourseUseCase() {
  const coursesRepository = new PrismaCoursesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new UpdateCourseUseCase(coursesRepository, usersRepository)

  return useCase
}
