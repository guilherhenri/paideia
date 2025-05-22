import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { CreateCourseUseCase } from './create-course'

describe('CreateCourseUseCase', () => {
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: CreateCourseUseCase

  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateCourseUseCase(coursesRepository, usersRepository)
  })

  it('should create a course with valid data', async () => {
    const instructor = await usersRepository.create({
      email: 'instructor@example.com',
      name: 'Instructor',
      role: 'INSTRUCTOR',
    })

    const response = await sut.execute({
      title: 'Test Course',
      description: 'Test Description',
      category: 'Test Category',
      logoImage: 'https://example.com/logo.jpg',
      accessDurationMonths: 6,
      instructorId: instructor.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        title: 'Test Course',
        instructor_id: instructor.id,
        status: 'draft',
      }),
    })
  })

  it('should reject creation if instructor does not exist', async () => {
    const response = await sut.execute({
      title: 'Test Course',
      description: 'Test Description',
      category: 'Test Category',
      logoImage: 'https://example.com/logo.jpg',
      accessDurationMonths: 6,
      instructorId: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Instrutor não encontrado.')
    }
  })
})
