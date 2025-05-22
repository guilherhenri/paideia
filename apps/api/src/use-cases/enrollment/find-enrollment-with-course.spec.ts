import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { EnrollmentRelations } from '@/repositories/interfaces/enrollments-repository'

import { FindEnrollmentWithCourseUseCase } from './find-enrollment-with-course'

describe('FindEnrollmentWithCourseUseCase', () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository
  let usersRepository: InMemoryUsersRepository
  let coursesRepository: InMemoryCoursesRepository
  let sut: FindEnrollmentWithCourseUseCase

  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentsRepository()
    usersRepository = new InMemoryUsersRepository()
    coursesRepository = new InMemoryCoursesRepository()

    sut = new FindEnrollmentWithCourseUseCase(enrollmentsRepository)
  })

  it('should find an enrollment with course', async () => {
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

    const enrollment = await enrollmentsRepository.create({
      user_id: user.id,
      course_id: course.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6),
    })

    enrollmentsRepository.enrollments[0] = {
      ...enrollment,
      course,
    } as EnrollmentRelations['WithCourse']

    const response = await sut.execute({
      id: enrollment.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      enrollment: expect.objectContaining({
        user_id: user.id,
        course: expect.objectContaining({
          title: 'Test Course',
        }),
      }),
    })
  })

  it('should return resource not found error if enrollment does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Matrícula não encontrada.')
    }
  })
})
