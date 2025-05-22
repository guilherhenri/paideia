import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ListLessonsUseCase } from './list-lessons'

describe('ListLessonsUseCase', () => {
  let lessonsRepository: InMemoryLessonsRepository
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: ListLessonsUseCase

  beforeEach(() => {
    lessonsRepository = new InMemoryLessonsRepository()
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new ListLessonsUseCase(lessonsRepository)
  })

  it('should list all lessons', async () => {
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

    await lessonsRepository.create({
      module_id: module.id,
      title: 'Lesson 1',
      description: 'Description 1',
      provider_type: 'youtube',
      provider_video_id: '123456',
      order: 1,
    })

    await lessonsRepository.create({
      module_id: module.id,
      title: 'Lesson 2',
      description: 'Description 2',
      provider_type: 'youtube',
      provider_video_id: '789012',
      order: 2,
    })

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.lessons).toHaveLength(2)
    expect(response.value).toEqual({
      lessons: expect.arrayContaining([
        expect.objectContaining({ title: 'Lesson 1' }),
        expect.objectContaining({ title: 'Lesson 2' }),
      ]),
    })
  })

  it('should list lessons by module id', async () => {
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

    await lessonsRepository.create({
      module_id: module1.id,
      title: 'Lesson 1',
      description: 'Description 1',
      provider_type: 'youtube',
      provider_video_id: '123456',
      order: 1,
    })

    await lessonsRepository.create({
      module_id: module2.id,
      title: 'Lesson 2',
      description: 'Description 2',
      provider_type: 'youtube',
      provider_video_id: '789012',
      order: 1,
    })

    const response = await sut.execute({ moduleId: module1.id })

    expect(response.isRight()).toBe(true)
    expect(response.value.lessons).toHaveLength(1)
    expect(response.value).toEqual({
      lessons: expect.arrayContaining([
        expect.objectContaining({
          title: 'Lesson 1',
          module_id: module1.id,
        }),
      ]),
    })
  })

  it('should return empty list if no lessons exist', async () => {
    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.lessons).toHaveLength(0)
    expect(response.value).toEqual({ lessons: [] })
  })
})
