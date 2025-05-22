import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCourseMaterialsRepository } from '@/repositories/in-memory/in-memory-course-materials-repository'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { CreateCourseMaterialUseCase } from './create-course-material'

describe('CreateCourseMaterialUseCase', () => {
  let courseMaterialsRepository: InMemoryCourseMaterialsRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: CreateCourseMaterialUseCase

  beforeEach(() => {
    courseMaterialsRepository = new InMemoryCourseMaterialsRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new CreateCourseMaterialUseCase(
      courseMaterialsRepository,
      coursesRepository,
    )
  })

  it('should create a course material with valid data', async () => {
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
      courseId: course.id,
      title: 'Test Material',
      downloadUrl: 'https://example.com/material.pdf',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      courseMaterial: expect.objectContaining({
        course_id: course.id,
        title: 'Test Material',
        download_url: 'https://example.com/material.pdf',
      }),
    })
  })

  it('should reject creation if course does not exist', async () => {
    const response = await sut.execute({
      courseId: 'non-existent-id',
      title: 'Test Material',
      downloadUrl: 'https://example.com/material.pdf',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Curso não encontrado.')
    }
  })
})
