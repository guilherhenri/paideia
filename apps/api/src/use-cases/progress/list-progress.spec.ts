import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryProgressesRepository } from '@/repositories/in-memory/in-memory-progresses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ListProgressUseCase } from './list-progress'

describe('ListProgressUseCase', () => {
  let progressesRepository: InMemoryProgressesRepository
  let usersRepository: InMemoryUsersRepository
  let lessonsRepository: InMemoryLessonsRepository
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let sut: ListProgressUseCase

  beforeEach(() => {
    progressesRepository = new InMemoryProgressesRepository()
    usersRepository = new InMemoryUsersRepository()
    lessonsRepository = new InMemoryLessonsRepository()
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()

    sut = new ListProgressUseCase(progressesRepository)
  })

  it('should list all progresses', async () => {
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

    await progressesRepository.create({
      user_id: user.id,
      lesson_id: lesson.id,
    })

    await progressesRepository.create({
      user_id: user.id,
      lesson_id: lesson.id,
    })

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.progresses).toHaveLength(2)
    expect(response.value).toEqual({
      progresses: expect.arrayContaining([
        expect.objectContaining({ user_id: user.id }),
        expect.objectContaining({ user_id: user.id }),
      ]),
    })
  })

  it('should list progresses by user id', async () => {
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

    await progressesRepository.create({
      user_id: user1.id,
      lesson_id: lesson.id,
    })

    await progressesRepository.create({
      user_id: user2.id,
      lesson_id: lesson.id,
    })

    const response = await sut.execute({ userId: user1.id })

    expect(response.isRight()).toBe(true)
    expect(response.value.progresses).toHaveLength(1)
    expect(response.value).toEqual({
      progresses: expect.arrayContaining([
        expect.objectContaining({
          user_id: user1.id,
          lesson_id: lesson.id,
        }),
      ]),
    })
  })

  it('should list progresses by lesson id', async () => {
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

    await progressesRepository.create({
      user_id: user.id,
      lesson_id: lesson1.id,
    })

    await progressesRepository.create({
      user_id: user.id,
      lesson_id: lesson2.id,
    })

    const response = await sut.execute({ lessonId: lesson1.id })

    expect(response.isRight()).toBe(true)
    expect(response.value.progresses).toHaveLength(1)
    expect(response.value).toEqual({
      progresses: expect.arrayContaining([
        expect.objectContaining({
          user_id: user.id,
          lesson_id: lesson1.id,
        }),
      ]),
    })
  })

  it('should return empty list if no progresses exist', async () => {
    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.progresses).toHaveLength(0)
    expect(response.value).toEqual({ progresses: [] })
  })
})
