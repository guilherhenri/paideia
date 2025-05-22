import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { ModuleRelations } from '@/repositories/interfaces/modules-repository'

import { FindModuleWithLessonsUseCase } from './find-module-with-lessons'

describe('FindModuleWithLessonsUseCase', () => {
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let lessonsRepository: InMemoryLessonsRepository
  let sut: FindModuleWithLessonsUseCase

  beforeEach(() => {
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    lessonsRepository = new InMemoryLessonsRepository()
    sut = new FindModuleWithLessonsUseCase(modulesRepository)
  })

  it('should find a module with lessons', async () => {
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

    const lesson = await lessonsRepository.create({
      module_id: module.id,
      title: 'Test Lesson',
      description: 'Lesson Description',
      provider_type: 'youtube',
      provider_video_id: '123456',
      order: 1,
    })

    modulesRepository.modules[0] = {
      ...module,
      lessons: [lesson],
    } as ModuleRelations['WithLessons']

    const response = await sut.execute({
      id: module.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      module: expect.objectContaining({
        title: 'Test Module',
        lessons: expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Lesson',
          }),
        ]),
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

  it('should return module with empty lessons if none exist', async () => {
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

    modulesRepository.modules[0] = {
      ...module,
      lessons: [],
    } as ModuleRelations['WithLessons']

    const response = await sut.execute({
      id: module.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      module: expect.objectContaining({
        title: 'Test Module',
        lessons: [],
      }),
    })
  })
})
