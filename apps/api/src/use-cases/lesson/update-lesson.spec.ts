import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UpdateLessonUseCase } from './update-lesson'

describe('UpdateLessonUseCase', () => {
  let lessonsRepository: InMemoryLessonsRepository
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: UpdateLessonUseCase

  beforeEach(() => {
    lessonsRepository = new InMemoryLessonsRepository()
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new UpdateLessonUseCase(lessonsRepository, modulesRepository)
  })

  it('should update lesson data', async () => {
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
      title: 'Updated Lesson',
      description: 'Updated Description',
      providerType: 'youtube',
      providerVideoId: '789012',
      order: 2,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      lesson: expect.objectContaining({
        title: 'Updated Lesson',
        description: 'Updated Description',
        provider_type: 'youtube',
        provider_video_id: '789012',
        order: 2,
        module_id: module.id,
      }),
    })
  })

  it('should update lesson with new module', async () => {
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

    const module1 = await modulesRepository.create({
      course_id: course.id,
      title: 'Module 1',
      description: 'Description 1',
      order: 1,
    })

    const module2 = await modulesRepository.create({
      course_id: course.id,
      title: 'Module 2',
      description: 'Description 2',
      order: 2,
    })

    const lesson = await lessonsRepository.create({
      module_id: module1.id,
      title: 'Test Lesson',
      description: 'Lesson Description',
      provider_type: 'youtube',
      provider_video_id: '123456',
      order: 1,
    })

    const response = await sut.execute({
      id: lesson.id,
      moduleId: module2.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      lesson: expect.objectContaining({
        title: 'Test Lesson',
        module_id: module2.id,
      }),
    })
  })

  it('should return resource not found error if lesson does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
      title: 'Updated Lesson',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Aula não encontrada.')
    }
  })

  it('should return resource not found error if new module does not exist', async () => {
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
      moduleId: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Módulo não encontrado.')
    }
  })
})
