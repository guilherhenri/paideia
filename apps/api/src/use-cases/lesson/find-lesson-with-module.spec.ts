import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { LessonRelations } from '@/repositories/interfaces/lessons-repository'

import { FindLessonWithModuleUseCase } from './find-lesson-with-module'

describe('FindLessonWithModuleUseCase', () => {
  let lessonsRepository: InMemoryLessonsRepository
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: FindLessonWithModuleUseCase

  beforeEach(() => {
    lessonsRepository = new InMemoryLessonsRepository()
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FindLessonWithModuleUseCase(lessonsRepository)
  })

  it('should find a lesson with module', async () => {
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

    lessonsRepository.lessons[0] = {
      ...lesson,
      module,
    } as LessonRelations['WithModule']

    const response = await sut.execute({
      id: lesson.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      lesson: expect.objectContaining({
        title: 'Test Lesson',
        module: expect.objectContaining({
          title: 'Test Module',
        }),
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
