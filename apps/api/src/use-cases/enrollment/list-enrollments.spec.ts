import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ListEnrollmentsUseCase } from './list-enrollments'

describe('ListEnrollmentsUseCase', () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository
  let usersRepository: InMemoryUsersRepository
  let coursesRepository: InMemoryCoursesRepository
  let sut: ListEnrollmentsUseCase

  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentsRepository()
    usersRepository = new InMemoryUsersRepository()
    coursesRepository = new InMemoryCoursesRepository()
    sut = new ListEnrollmentsUseCase(enrollmentsRepository)
  })

  it('should list all enrollments', async () => {
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

    await enrollmentsRepository.create({
      user_id: user.id,
      course_id: course.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6),
    })

    await enrollmentsRepository.create({
      user_id: user.id,
      course_id: course.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 12),
    })

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.enrollments).toHaveLength(2)
    expect(response.value).toEqual({
      enrollments: expect.arrayContaining([
        expect.objectContaining({ user_id: user.id }),
        expect.objectContaining({ user_id: user.id }),
      ]),
    })
  })

  it('should list enrollments by user id', async () => {
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

    await enrollmentsRepository.create({
      user_id: user1.id,
      course_id: course.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6),
    })

    await enrollmentsRepository.create({
      user_id: user2.id,
      course_id: course.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6),
    })

    const response = await sut.execute({ userId: user1.id })

    expect(response.isRight()).toBe(true)
    expect(response.value.enrollments).toHaveLength(1)
    expect(response.value).toEqual({
      enrollments: expect.arrayContaining([
        expect.objectContaining({
          user_id: user1.id,
          course_id: course.id,
        }),
      ]),
    })
  })

  it('should list enrollments by course id', async () => {
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

    await enrollmentsRepository.create({
      user_id: user.id,
      course_id: course1.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6),
    })

    await enrollmentsRepository.create({
      user_id: user.id,
      course_id: course2.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 12),
    })

    const response = await sut.execute({ courseId: course1.id })

    expect(response.isRight()).toBe(true)
    expect(response.value.enrollments).toHaveLength(1)
    expect(response.value).toEqual({
      enrollments: expect.arrayContaining([
        expect.objectContaining({
          user_id: user.id,
          course_id: course1.id,
        }),
      ]),
    })
  })

  it('should return empty list if no enrollments exist', async () => {
    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.enrollments).toHaveLength(0)
    expect(response.value).toEqual({ enrollments: [] })
  })
})
