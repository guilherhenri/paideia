import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCourseMaterialsRepository } from '@/repositories/in-memory/in-memory-course-materials-repository'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { CourseMaterialRelations } from '@/repositories/interfaces/course-materials-repository'

import { FindCourseMaterialWithCourseUseCase } from './find-course-material-with-course'

describe('FindCourseMaterialWithCourseUseCase', () => {
  let courseMaterialsRepository: InMemoryCourseMaterialsRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: FindCourseMaterialWithCourseUseCase

  beforeEach(() => {
    courseMaterialsRepository = new InMemoryCourseMaterialsRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new FindCourseMaterialWithCourseUseCase(courseMaterialsRepository)
  })

  it('should find a course material with course', async () => {
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

    const courseMaterial = await courseMaterialsRepository.create({
      course_id: course.id,
      title: 'Test Material',
      download_url: 'https://example.com/material.pdf',
    })

    courseMaterialsRepository.materials[0] = {
      ...courseMaterial,
      course,
    } as CourseMaterialRelations['WithCourse']

    const response = await sut.execute({
      id: courseMaterial.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      courseMaterial: expect.objectContaining({
        title: 'Test Material',
        course: expect.objectContaining({
          title: 'Test Course',
        }),
      }),
    })
  })

  it('should return resource not found error if course material does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Material do curso não encontrado.')
    }
  })
})
