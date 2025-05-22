import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { FindLessonByIdUseCase } from './find-lesson-by-id'

describe('FindLessonByIdUseCase', () => {
  let lessonsRepository: InMemoryLessonsRepository
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: FindLessonByIdUseCase

  beforeEach(() => {
    lessonsRepository = new InMemoryLessonsRepository()
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new FindLessonByIdUseCase(lessonsRepository)
  })

  it('should find a lesson by id', async () => {
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

    const response = await sut.execute({
      id: lesson.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      lesson: expect.objectContaining({
        id: lesson.id,
        title: 'Test Lesson',
        module_id: module.id,
        provider_type: 'youtube',
      }),
    })
  })

  it('should return resource not found error if lesson does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Aula não encontrada.')
    }
  })
})
