import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { FindModuleByIdUseCase } from './find-module-by-id'

describe('FindModuleByIdUseCase', () => {
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: FindModuleByIdUseCase

  beforeEach(() => {
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FindModuleByIdUseCase(modulesRepository)
  })

  it('should find a module by id', async () => {
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

    const module = await modulesRepository.create({
      course_id: course.id,
      title: 'Test Module',
      description: 'Module Description',
      order: 1,
    })

    const response = await sut.execute({
      id: module.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      module: expect.objectContaining({
        id: module.id,
        title: 'Test Module',
        course_id: course.id,
      }),
    })
  })

  it('should return resource not found error if module does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Módulo não encontrado.')
    }
  })
})
