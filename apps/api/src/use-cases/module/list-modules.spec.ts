import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ListModulesUseCase } from './list-modules'

describe('ListModulesUseCase', () => {
  let modulesRepository: InMemoryModulesRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: ListModulesUseCase

  beforeEach(() => {
    modulesRepository = new InMemoryModulesRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new ListModulesUseCase(modulesRepository)
  })

  it('should list all modules', async () => {
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

    await modulesRepository.create({
      course_id: course.id,
      title: 'Module 1',
      description: 'Description 1',
      order: 1,
    })

    await modulesRepository.create({
      course_id: course.id,
      title: 'Module 2',
      description: 'Description 2',
      order: 2,
    })

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.modules).toHaveLength(2)
    expect(response.value).toEqual({
      modules: expect.arrayContaining([
        expect.objectContaining({ title: 'Module 1' }),
        expect.objectContaining({ title: 'Module 2' }),
      ]),
    })
  })

  it('should list modules by course id', async () => {
    const instructor = await usersRepository.create({
      email: 'instructor@example.com',
      name: 'Instructor',
      role: 'INSTRUCTOR',
    })

    const course1 = await coursesRepository.create({
      title: 'Course 1',
      description: 'Description 1',
      category: 'Category 1',
      logo_image: 'https://example.com/logo1.jpg',
      access_duration_months: 6,
      instructor_id: instructor.id,
      status: 'approved',
    })

    const course2 = await coursesRepository.create({
      title: 'Course 2',
      description: 'Description 2',
      category: 'Category 2',
      logo_image: 'https://example.com/logo2.jpg',
      access_duration_months: 12,
      instructor_id: instructor.id,
      status: 'approved',
    })

    await modulesRepository.create({
      course_id: course1.id,
      title: 'Module 1',
      description: 'Description 1',
      order: 1,
    })

    await modulesRepository.create({
      course_id: course2.id,
      title: 'Module 2',
      description: 'Description 2',
      order: 1,
    })

    const response = await sut.execute({ courseId: course1.id })

    expect(response.isRight()).toBe(true)
    expect(response.value.modules).toHaveLength(1)
    expect(response.value).toEqual({
      modules: expect.arrayContaining([
        expect.objectContaining({
          title: 'Module 1',
          course_id: course1.id,
        }),
      ]),
    })
  })

  it('should return empty list if no modules exist', async () => {
    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.modules).toHaveLength(0)
    expect(response.value).toEqual({ modules: [] })
  })
})
