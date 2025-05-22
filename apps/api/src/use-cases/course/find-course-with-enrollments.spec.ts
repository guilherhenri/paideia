import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { CourseRelations } from '@/repositories/interfaces/courses-repository'

import { FindCourseWithEnrollmentsUseCase } from './find-course-with-enrollments'

describe('FindCourseWithEnrollmentsUseCase', () => {
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let enrollmentsRepository: InMemoryEnrollmentsRepository
  let sut: FindCourseWithEnrollmentsUseCase

  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    enrollmentsRepository = new InMemoryEnrollmentsRepository()
    sut = new FindCourseWithEnrollmentsUseCase(coursesRepository)
  })

  it('should find a course with enrollments', async () => {
    const instructor = await usersRepository.create({
      email: 'instructor@example.com',
      name: 'Instructor',
      role: 'INSTRUCTOR',
    })

    const student = await usersRepository.create({
      email: 'student@example.com',
      name: 'Student',
      role: 'STUDENT',
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

    const enrollment = await enrollmentsRepository.create({
      user_id: student.id,
      course_id: course.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6),
    })

    coursesRepository.courses[0] = {
      ...course,
      enrollments: [{ ...enrollment, user: student }],
    } as CourseRelations['WithEnrollments']

    const response = await sut.execute({
      id: course.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        title: 'Test Course',
        enrollments: expect.arrayContaining([
          expect.objectContaining({
            user: expect.objectContaining({
              email: 'student@example.com',
            }),
          }),
        ]),
      }),
    })
  })

  it('should return resource not found error if course does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Curso não encontrado.')
    }
  })

  it('should return course with empty enrollments if none exist', async () => {
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

    coursesRepository.courses[0] = {
      ...course,
      enrollments: [],
    } as CourseRelations['WithEnrollments']

    const response = await sut.execute({
      id: course.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        title: 'Test Course',
        enrollments: [],
      }),
    })
  })
})
