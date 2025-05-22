import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCourseMaterialsRepository } from '@/repositories/in-memory/in-memory-course-materials-repository'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ListCourseMaterialsUseCase } from './list-course-materials'

describe('ListCourseMaterialsUseCase', () => {
  let courseMaterialsRepository: InMemoryCourseMaterialsRepository
  let coursesRepository: InMemoryCoursesRepository
  let usersRepository: InMemoryUsersRepository
  let sut: ListCourseMaterialsUseCase

  beforeEach(() => {
    courseMaterialsRepository = new InMemoryCourseMaterialsRepository()
    coursesRepository = new InMemoryCoursesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new ListCourseMaterialsUseCase(courseMaterialsRepository)
  })

  it('should list all course materials', async () => {
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

    await courseMaterialsRepository.create({
      course_id: course.id,
      title: 'Material 1',
      download_url: 'https://example.com/material1.pdf',
    })

    await courseMaterialsRepository.create({
      course_id: course.id,
      title: 'Material 2',
      download_url: 'https://example.com/material2.pdf',
    })

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.courseMaterials).toHaveLength(2)
    expect(response.value).toEqual({
      courseMaterials: expect.arrayContaining([
        expect.objectContaining({ title: 'Material 1' }),
        expect.objectContaining({ title: 'Material 2' }),
      ]),
    })
  })

  it('should list course materials by course id', async () => {
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

    await courseMaterialsRepository.create({
      course_id: course1.id,
      title: 'Material 1',
      download_url: 'https://example.com/material1.pdf',
    })

    await courseMaterialsRepository.create({
      course_id: course2.id,
      title: 'Material 2',
      download_url: 'https://example.com/material2.pdf',
    })

    const response = await sut.execute({ courseId: course1.id })

    expect(response.isRight()).toBe(true)
    expect(response.value.courseMaterials).toHaveLength(1)
    expect(response.value).toEqual({
      courseMaterials: expect.arrayContaining([
        expect.objectContaining({
          course_id: course1.id,
          title: 'Material 1',
        }),
      ]),
    })
  })

  it('should return empty list if no course materials exist', async () => {
    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.courseMaterials).toHaveLength(0)
    expect(response.value).toEqual({ courseMaterials: [] })
  })
})
