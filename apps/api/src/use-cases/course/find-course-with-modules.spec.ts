import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryModulesRepository } from '@/repositories/in-memory/in-memory-modules-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { CourseRelations } from '@/repositories/interfaces/courses-repository'

import { FindCourseWithModulesUseCase } from './find-course-with-modules'

describe('FindCourseWithModulesUseCase', () => {
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let modulesRepository: InMemoryModulesRepository
  let sut: FindCourseWithModulesUseCase

  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()
    modulesRepository = new InMemoryModulesRepository()
    sut = new FindCourseWithModulesUseCase(coursesRepository)
  })

  it('should find a course with modules', async () => {
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

    const module = await modulesRepository.create({
      course_id: course.id,
      title: 'Test Module',
      description: 'Module Description',
      order: 1,
    })

    coursesRepository.courses[0] = {
      ...course,
      modules: [module],
    } as CourseRelations['WithModules']

    const response = await sut.execute({
      id: course.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        title: 'Test Course',
        modules: expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Module',
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

  it('should return course with empty modules if none exist', async () => {
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
      modules: [],
    } as CourseRelations['WithModules']

    const response = await sut.execute({
      id: course.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      course: expect.objectContaining({
        title: 'Test Course',
        modules: [],
      }),
    })
  })
})
