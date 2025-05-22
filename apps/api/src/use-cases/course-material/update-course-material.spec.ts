import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCourseMaterialsRepository } from '@/repositories/in-memory/in-memory-course-materials-repository'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UpdateCourseMaterialUseCase } from './update-course-material'

describe('UpdateCourseMaterialUseCase', () => {
  let courseMaterialsRepository: InMemoryCourseMaterialsRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: UpdateCourseMaterialUseCase

  beforeEach(() => {
    courseMaterialsRepository = new InMemoryCourseMaterialsRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new UpdateCourseMaterialUseCase(
      courseMaterialsRepository,
      coursesRepository,
    )
  })

  it('should update course material data', async () => {
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

    const newTitle = 'Updated Material'
    const newDownloadUrl = 'https://example.com/updated-material.pdf'

    const response = await sut.execute({
      id: courseMaterial.id,
      title: newTitle,
      downloadUrl: newDownloadUrl,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      courseMaterial: expect.objectContaining({
        course_id: course.id,
        title: newTitle,
        download_url: newDownloadUrl,
      }),
    })
  })

  it('should update course material with new course', async () => {
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

    const courseMaterial = await courseMaterialsRepository.create({
      course_id: course1.id,
      title: 'Test Material',
      download_url: 'https://example.com/material.pdf',
    })

    const response = await sut.execute({
      id: courseMaterial.id,
      courseId: course2.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      courseMaterial: expect.objectContaining({
        course_id: course2.id,
        title: 'Test Material',
      }),
    })
  })

  it('should return resource not found error if course material does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
      title: 'Updated Material',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Material do curso não encontrado.')
    }
  })

  it('should return resource not found error if new course does not exist', async () => {
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

    const response = await sut.execute({
      id: courseMaterial.id,
      courseId: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)

    if (response.isLeft()) {
      expect(response.value.message).toBe('Curso não encontrado.')
    }
  })
})
