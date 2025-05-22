import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { CreateModuleUseCase } from './create-module'

describe('CreateModuleUseCase', () => {
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: CreateModuleUseCase

  beforeEach(() => {
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateModuleUseCase(modulesRepository, coursesRepository)
  })

  it('should create a module with valid data', async () => {
    const instructor = await usersRepository.create({
      email: 'instructor@example.com',
      name: 'Instructor',
      role: 'INSTRUCTOR',
    })

    const course = await coursesRepository.create({
      title: 'Test Course',
      description: 'Test Description',
      category: 'Test Category',
      logo_image: 'https://example.com/logo.jpg',
      access_duration_months: 6,
      instructor_id: instructor.id,
      status: 'approved',
    })

    const response = await sut.execute({
      courseId: course.id,
      title: 'Test Module',
      description: 'Module Description',
      order: 1,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      module: expect.objectContaining({
        course_id: course.id,
        title: 'Test Module',
        description: 'Module Description',
        order: 1,
      }),
    })
  })

  it('should reject creation if course does not exist', async () => {
    const response = await sut.execute({
      courseId: 'non-existent-id',
      title: 'Test Module',
      description: 'Module Description',
      order: 1,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Curso não encontrado.')
    }
  })
})
