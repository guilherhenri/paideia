import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { CreateEnrollmentUseCase } from './create-enrollment'

describe('CreateEnrollmentUseCase', () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository
  let usersRepository: InMemoryUsersRepository
  let coursesRepository: InMemoryCoursesRepository
  let sut: CreateEnrollmentUseCase

  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentsRepository()
    usersRepository = new InMemoryUsersRepository()
    coursesRepository = new InMemoryCoursesRepository()

    sut = new CreateEnrollmentUseCase(
      enrollmentsRepository,
      usersRepository,
      coursesRepository,
    )
  })

  it('should create an enrollment with valid data', async () => {
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

    const accessExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6)

    const response = await sut.execute({
      userId: user.id,
      courseId: course.id,
      accessExpiresAt,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      enrollment: expect.objectContaining({
        user_id: user.id,
        course_id: course.id,
        access_expires_at: accessExpiresAt,
      }),
    })
  })

  it('should reject creation if user does not exist', async () => {
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

    const accessExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6)

    const response = await sut.execute({
      userId: 'non-existent-id',
      courseId: course.id,
      accessExpiresAt,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Usuário não encontrado.')
    }
  })

  it('should reject creation if course does not exist', async () => {
    const user = await usersRepository.create({
      email: 'student@example.com',
      name: 'Student',
      role: 'STUDENT',
    })

    const accessExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6)

    const response = await sut.execute({
      userId: user.id,
      courseId: 'non-existent-id',
      accessExpiresAt,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Curso não encontrado.')
    }
  })
})
