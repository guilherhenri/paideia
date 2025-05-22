import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCourseMaterialsRepository } from '@/repositories/in-memory/in-memory-course-materials-repository'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { CourseRelations } from '@/repositories/interfaces/courses-repository'

import { FindCourseWithMaterialsUseCase } from './find-course-with-materials'

describe('FindCourseWithMaterialsUseCase', () => {
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let courseMaterialsRepository: InMemoryCourseMaterialsRepository
  let sut: FindCourseWithMaterialsUseCase

  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    courseMaterialsRepository = new InMemoryCourseMaterialsRepository()
    sut = new FindCourseWithMaterialsUseCase(coursesRepository)
  })

  it('should find a course with materials', async () => {
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

    const material = await courseMaterialsRepository.create({
      course_id: course.id,
      title: 'Test Material',
      download_url: 'https://example.com/material.pdf',
    })

    coursesRepository.courses[0] = {
      ...course,
      materials: [material],
    } as CourseRelations['WithMaterials']

    const response = await sut.execute({
      id: course.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        title: 'Test Course',
        materials: expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Material',
          }),
        ]),
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

  it('should return course with empty materials if none exist', async () => {
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

    coursesRepository.courses[0] = {
      ...course,
      materials: [],
    } as CourseRelations['WithMaterials']

    const response = await sut.execute({
      id: course.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        title: 'Test Course',
        materials: [],
      }),
    })
  })
})
