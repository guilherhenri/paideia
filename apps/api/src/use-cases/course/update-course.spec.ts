import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UpdateCourseUseCase } from './update-course'

describe('UpdateCourseUseCase', () => {
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: UpdateCourseUseCase

  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateCourseUseCase(coursesRepository, usersRepository)
  })

  it('should update course data', async () => {
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
      status: 'draft',
    })

    const response = await sut.execute({
      id: course.id,
      title: 'Updated Course',
      description: 'Updated Description',
      category: 'Updated Category',
      logoImage: 'https://example.com/new-logo.jpg',
      accessDurationMonths: 12,
      status: 'approved',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        title: 'Updated Course',
        description: 'Updated Description',
        category: 'Updated Category',
        logo_image: 'https://example.com/new-logo.jpg',
        access_duration_months: 12,
        status: 'approved',
      }),
    })
  })

  it('should update course with new instructor', async () => {
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

    const course = await coursesRepository.create({
      title: 'Test Course',
      description: 'Test Description',
      category: 'Test Category',
      logo_image: 'https://example.com/logo.jpg',
      access_duration_months: 6,
      instructor_id: instructor1.id,
      status: 'draft',
    })

    const response = await sut.execute({
      id: course.id,
      instructorId: instructor2.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        title: 'Test Course',
        instructor_id: instructor2.id,
      }),
    })
  })

  it('should return resource not found error if course does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
      title: 'Updated Course',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Curso não encontrado.')
    }
  })

  it('should return resource not found error if new instructor does not exist', async () => {
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
      status: 'draft',
    })

    const response = await sut.execute({
      id: course.id,
      instructorId: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Instrutor não encontrado.')
    }
  })
})
