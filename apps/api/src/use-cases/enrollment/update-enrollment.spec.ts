import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UpdateEnrollmentUseCase } from './update-enrollment'

describe('UpdateEnrollmentUseCase', () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository
  let usersRepository: InMemoryUsersRepository
  let coursesRepository: InMemoryCoursesRepository
  let sut: UpdateEnrollmentUseCase

  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentsRepository()
    usersRepository = new InMemoryUsersRepository()
    coursesRepository = new InMemoryCoursesRepository()

    sut = new UpdateEnrollmentUseCase(
      enrollmentsRepository,
      usersRepository,
      coursesRepository,
    )
  })

  it('should update enrollment data', async () => {
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

    const newAccessExpiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30 * 12,
    )

    const response = await sut.execute({
      id: enrollment.id,
      accessExpiresAt: newAccessExpiresAt,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      enrollment: expect.objectContaining({
        user_id: user.id,
        course_id: course.id,
        access_expires_at: newAccessExpiresAt,
      }),
    })
  })

  it('should update enrollment with new user', async () => {
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

    const enrollment = await enrollmentsRepository.create({
      user_id: user1.id,
      course_id: course.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6),
    })

    const response = await sut.execute({
      id: enrollment.id,
      userId: user2.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      enrollment: expect.objectContaining({
        user_id: user2.id,
        course_id: course.id,
      }),
    })
  })

  it('should update enrollment with new course', async () => {
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

    const enrollment = await enrollmentsRepository.create({
      user_id: user.id,
      course_id: course1.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6),
    })

    const response = await sut.execute({
      id: enrollment.id,
      courseId: course2.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      enrollment: expect.objectContaining({
        user_id: user.id,
        course_id: course2.id,
      }),
    })
  })

  it('should return resource not found error if enrollment does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
      accessExpiresAt: new Date(),
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Matrícula não encontrada.')
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

    const enrollment = await enrollmentsRepository.create({
      user_id: user.id,
      course_id: course.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6),
    })

    const response = await sut.execute({
      id: enrollment.id,
      userId: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Usuário não encontrado.')
    }
  })

  it('should return resource not found error if new course does not exist', async () => {
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

    const response = await sut.execute({
      id: enrollment.id,
      courseId: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)

    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Curso não encontrado.')
    }
  })
})
