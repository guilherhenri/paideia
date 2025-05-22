import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryProgressesRepository } from '@/repositories/in-memory/in-memory-progresses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UpdateProgressUseCase } from './update-progress'

describe('UpdateProgressUseCase', () => {
  let progressesRepository: InMemoryProgressesRepository
  let usersRepository: InMemoryUsersRepository
  let lessonsRepository: InMemoryLessonsRepository
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let sut: UpdateProgressUseCase

  beforeEach(() => {
    progressesRepository = new InMemoryProgressesRepository()
    usersRepository = new InMemoryUsersRepository()
    lessonsRepository = new InMemoryLessonsRepository()
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    sut = new UpdateProgressUseCase(
      progressesRepository,
      usersRepository,
      lessonsRepository,
    )
  })

  it('should update progress data', async () => {
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

    const response = await sut.execute({
      id: progress.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      progress: expect.objectContaining({
        user_id: user.id,
        lesson_id: lesson.id,
      }),
    })
  })

  it('should update progress with new user', async () => {
    const user1 = await usersRepository.create({
      email: 'student1@example.com',
      name: 'Student 1',
      role: 'STUDENT',
    })

    const user2 = await usersRepository.create({
      email: 'student2@example.com',
      name: 'Student 2',
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
      user_id: user1.id,
      lesson_id: lesson.id,
    })

    const response = await sut.execute({
      id: progress.id,
      userId: user2.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      progress: expect.objectContaining({
        user_id: user2.id,
        lesson_id: lesson.id,
      }),
    })
  })

  it('should update progress with new lesson', async () => {
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

    const lesson1 = await lessonsRepository.create({
      module_id: module.id,
      title: 'Lesson 1',
      description: 'Description 1',
      provider_type: 'youtube',
      provider_video_id: '123456',
      order: 1,
    })

    const lesson2 = await lessonsRepository.create({
      module_id: module.id,
      title: 'Lesson 2',
      description: 'Description 2',
      provider_type: 'panda',
      provider_video_id: '789012',
      order: 2,
    })

    const progress = await progressesRepository.create({
      user_id: user.id,
      lesson_id: lesson1.id,
    })

    const response = await sut.execute({
      id: progress.id,
      lessonId: lesson2.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      progress: expect.objectContaining({
        user_id: user.id,
        lesson_id: lesson2.id,
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

  it('should return resource not found error if new user does not exist', async () => {
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

    const response = await sut.execute({
      id: progress.id,
      userId: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Usuário não encontrado.')
    }
  })

  it('should return resource not found error if new lesson does not exist', async () => {
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

    const response = await sut.execute({
      id: progress.id,
      lessonId: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Aula não encontrada.')
    }
  })
})
