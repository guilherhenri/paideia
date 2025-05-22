import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { UserRelations } from '@/repositories/interfaces/users-repository'

import { FindUserWithEnrolledCoursesUseCase } from './find-user-with-enrolled-courses'

describe('FindUserWithEnrolledCoursesUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let enrollmentsRepository: InMemoryEnrollmentsRepository
  let coursesRepository: InMemoryCoursesRepository
  let sut: FindUserWithEnrolledCoursesUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    enrollmentsRepository = new InMemoryEnrollmentsRepository()
    coursesRepository = new InMemoryCoursesRepository()
    sut = new FindUserWithEnrolledCoursesUseCase(usersRepository)
  })

  it('should find a user with enrolled courses', async () => {
    const user = await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
    })

    const course = await coursesRepository.create({
      title: 'Test Course',
      description: 'Test Description',
      category: 'Test Category',
      logo_image: 'https://example.com/logo.jpg',
      access_duration_months: 6,
      instructor_id: 'instructor-id',
      status: 'approved',
    })

    await enrollmentsRepository.create({
      user_id: user.id,
      course_id: course.id,
      access_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6), // 6 months
    })

    // Simula comportamento do Prisma no in-memory
    usersRepository.users[0] = {
      ...usersRepository.users[0],
      enrollments: [
        {
          id: 'enrollment-id',
          user_id: user.id,
          course_id: course.id,
          access_expires_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          course,
        },
      ],
    } as UserRelations['WithEnrolledCourses']

    const response = await sut.execute({
      id: user.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
        enrollments: expect.arrayContaining([
          expect.objectContaining({
            course: expect.objectContaining({
              title: 'Test Course',
            }),
          }),
        ]),
      }),
    })
  })

  it('should return not found error if user does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Usuário não encontrado.')
    }
  })

  it('should return user with empty enrollments if no courses are enrolled', async () => {
    const user = await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
    })

    usersRepository.users[0] = {
      ...usersRepository.users[0],
      enrollments: [],
    } as UserRelations['WithEnrolledCourses']

    const response = await sut.execute({
      id: user.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
        enrollments: [],
      }),
    })
  })
})
