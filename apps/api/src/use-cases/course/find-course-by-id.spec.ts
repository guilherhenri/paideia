import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { FindCourseByIdUseCase } from './find-course-by-id'

describe('FindCourseByIdUseCase', () => {
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: FindCourseByIdUseCase

  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FindCourseByIdUseCase(coursesRepository)
  })

  it('should find a course by id', async () => {
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

    const response = await sut.execute({
      id: course.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        id: course.id,
        title: 'Test Course',
        instructor_id: instructor.id,
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
})
