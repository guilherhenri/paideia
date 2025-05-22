import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ListCoursesUseCase } from './list-courses'

describe('ListCoursesUseCase', () => {
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: ListCoursesUseCase

  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new ListCoursesUseCase(coursesRepository)
  })

  it('should list all courses', async () => {
    const instructor = await usersRepository.create({
      email: 'instructor@example.com',
      name: 'Instructor',
      role: 'INSTRUCTOR',
    })

    await coursesRepository.create({
      title: 'Course 1',
      description: 'Description 1',
      category: 'Category 1',
      logo_image: 'https://example.com/logo1.jpg',
      access_duration_months: 6,
      instructor_id: instructor.id,
      status: 'approved',
    })

    await coursesRepository.create({
      title: 'Course 2',
      description: 'Description 2',
      category: 'Category 2',
      logo_image: 'https://example.com/logo2.jpg',
      access_duration_months: 12,
      instructor_id: instructor.id,
      status: 'draft',
    })

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.courses).toHaveLength(2)
    expect(response.value).toEqual({
      courses: expect.arrayContaining([
        expect.objectContaining({ title: 'Course 1' }),
        expect.objectContaining({ title: 'Course 2' }),
      ]),
    })
  })

  it('should list courses by instructor id', async () => {
    const instructor1 = await usersRepository.create({
      email: 'instructor1@example.com',
      name: 'Instructor 1',
      role: 'INSTRUCTOR',
    })

    const instructor2 = await usersRepository.create({
      email: 'instructor2@example.com',
      name: 'Instructor 2',
      role: 'INSTRUCTOR',
    })

    await coursesRepository.create({
      title: 'Course 1',
      description: 'Description 1',
      category: 'Category 1',
      logo_image: 'https://example.com/logo1.jpg',
      access_duration_months: 6,
      instructor_id: instructor1.id,
      status: 'approved',
    })

    await coursesRepository.create({
      title: 'Course 2',
      description: 'Description 2',
      category: 'Category 2',
      logo_image: 'https://example.com/logo2.jpg',
      access_duration_months: 12,
      instructor_id: instructor2.id,
      status: 'approved',
    })

    const response = await sut.execute({ instructorId: instructor1.id })

    expect(response.isRight()).toBe(true)
    expect(response.value.courses).toHaveLength(1)
    expect(response.value).toEqual({
      courses: expect.arrayContaining([
        expect.objectContaining({
          title: 'Course 1',
          instructor_id: instructor1.id,
        }),
      ]),
    })
  })

  it('should list courses by status', async () => {
    const instructor = await usersRepository.create({
      email: 'instructor@example.com',
      name: 'Instructor',
      role: 'INSTRUCTOR',
    })

    await coursesRepository.create({
      title: 'Course 1',
      description: 'Description 1',
      category: 'Category 1',
      logo_image: 'https://example.com/logo1.jpg',
      access_duration_months: 6,
      instructor_id: instructor.id,
      status: 'approved',
    })

    await coursesRepository.create({
      title: 'Course 2',
      description: 'Description 2',
      category: 'Category 2',
      logo_image: 'https://example.com/logo2.jpg',
      access_duration_months: 12,
      instructor_id: instructor.id,
      status: 'draft',
    })

    const response = await sut.execute({ status: 'approved' })

    expect(response.isRight()).toBe(true)
    expect(response.value.courses).toHaveLength(1)
    expect(response.value).toEqual({
      courses: expect.arrayContaining([
        expect.objectContaining({
          title: 'Course 1',
          status: 'approved',
        }),
      ]),
    })
  })

  it('should return empty list if no courses exist', async () => {
    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.courses).toHaveLength(0)
    expect(response.value).toEqual({ courses: [] })
  })
})
