import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryProgressesRepository } from '@/repositories/in-memory/in-memory-progresses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { ProgressRelations } from '@/repositories/interfaces/progresses-repository'

import { FindProgressWithUserUseCase } from './find-progress-with-user'

describe('FindProgressWithUserUseCase', () => {
  let progressesRepository: InMemoryProgressesRepository
  let usersRepository: InMemoryUsersRepository
  let lessonsRepository: InMemoryLessonsRepository
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let sut: FindProgressWithUserUseCase

  beforeEach(() => {
    progressesRepository = new InMemoryProgressesRepository()
    usersRepository = new InMemoryUsersRepository()
    lessonsRepository = new InMemoryLessonsRepository()
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()

    sut = new FindProgressWithUserUseCase(progressesRepository)
  })

  it('should find a progress with user', async () => {
    const user = await usersRepository.create({
      email: 'student@example.com',
      name: 'Student',
      role: 'STUDENT',
    })

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

    const progress = await progressesRepository.create({
      user_id: user.id,
      lesson_id: lesson.id,
    })

    progressesRepository.progresses[0] = {
      ...progress,
      user,
    } as ProgressRelations['WithUser']

    const response = await sut.execute({
      id: progress.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      progress: expect.objectContaining({
        lesson_id: lesson.id,
        user: expect.objectContaining({
          email: 'student@example.com',
        }),
      }),
    })
  })

  it('should return resource not found error if progress does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Progresso não encontrado.')
    }
  })
})
