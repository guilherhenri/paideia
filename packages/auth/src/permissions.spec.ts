import { v4 as uuid } from 'uuid'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { defineAbilityFor } from '.'
import { courseSchema } from './models/course'
import { courseMaterialSchema } from './models/course-material'
import { enrollmentSchema } from './models/enrollment'
import { lessonSchema } from './models/lesson'
import { moduleSchema } from './models/module'
import { progressSchema } from './models/progress'
import { userSchema } from './models/user'
import { permissions } from './permissions'

describe('Permissions', () => {
  it('should have permissions defined for all roles', () => {
    expectTypeOf(permissions.ADMIN).toBeFunction()
    expectTypeOf(permissions.INSTRUCTOR).toBeFunction()
    expectTypeOf(permissions.STUDENT).toBeFunction()
  })

  describe('Permissions for ADMIN role', () => {
    const admin = userSchema.parse({
      id: uuid(),
      email: 'admin@example.com',
      name: 'Admin',
      picture: 'https://test.com',
      role: 'ADMIN',
    })

    const course = courseSchema.parse({
      id: uuid(),
      title: 'Test Course',
      description: 'Description',
      category: 'Tech',
      logoImage: 'https://example.com/logo.jpg',
      accessDurationMonths: 12,
      instructorId: uuid(),
      status: 'approved',
    })

    const module = moduleSchema.parse({
      id: uuid(),
      courseId: course.id,
      title: 'Module 1',
      description: 'Module Description',
      order: 1,
      course,
    })

    const lesson = lessonSchema.parse({
      id: uuid(),
      moduleId: module.id,
      title: 'Lesson 1',
      description: 'Lesson Description',
      providerType: 'youtube',
      providerVideoId: 'abc123',
      comment: null,
      order: 1,
      module,
    })

    const enrollment = enrollmentSchema.parse({
      id: uuid(),
      userId: uuid(),
      courseId: course.id,
      accessExpiresAt: new Date(),
      course,
    })

    const progress = progressSchema.parse({
      id: uuid(),
      userId: uuid(),
      lessonId: lesson.id,
      completed: true,
      rating: 5,
      lesson,
    })

    const courseMaterial = courseMaterialSchema.parse({
      id: uuid(),
      courseId: course.id,
      title: 'Material 1',
      downloadUrl: 'https://example.com/material.pdf',
      course,
    })

    const ability = defineAbilityFor(admin)

    it('should allow ADMIN to manage User', () => {
      const user = userSchema.parse({
        id: uuid(),
        email: 'user@example.com',
        name: 'User',
        picture: 'https://test.com',
        role: 'STUDENT',
      })

      expect(ability.can('manage', user)).toBe(true)
    })

    it('should allow ADMIN to manage Course', () => {
      expect(ability.can('manage', course)).toBe(true)
    })

    it('should allow ADMIN to manage Module', () => {
      expect(ability.can('manage', module)).toBe(true)
    })

    it('should allow ADMIN to manage Lesson', () => {
      expect(ability.can('manage', lesson)).toBe(true)
    })

    it('should allow ADMIN to manage Enrollment', () => {
      expect(ability.can('manage', enrollment)).toBe(true)
    })

    it('should allow ADMIN to manage Progress', () => {
      expect(ability.can('manage', progress)).toBe(true)
    })

    it('should allow ADMIN to manage CourseMaterial', () => {
      expect(ability.can('manage', courseMaterial)).toBe(true)
    })
  })

  describe('Permissions for INSTRUCTOR role', () => {
    const instructor = userSchema.parse({
      id: uuid(),
      email: 'instructor@example.com',
      name: 'Instructor',
      picture: 'https://test.com',
      role: 'INSTRUCTOR',
    })

    const ownCourse = courseSchema.parse({
      id: uuid(),
      title: 'Test Course',
      description: 'Description',
      category: 'Tech',
      logoImage: 'https://example.com/logo.jpg',
      accessDurationMonths: 12,
      instructorId: instructor.id,
      status: 'approved',
    })

    const otherCourse = courseSchema.parse({
      id: uuid(),
      title: 'Other Course',
      description: 'Other Description',
      category: 'Tech',
      logoImage: 'https://example.com/other.jpg',
      accessDurationMonths: 12,
      instructorId: uuid(),
      status: 'approved',
    })

    const ownModule = moduleSchema.parse({
      id: uuid(),
      courseId: ownCourse.id,
      title: 'Module 1',
      description: 'Module Description',
      order: 1,
      course: ownCourse,
    })

    const otherModule = moduleSchema.parse({
      id: uuid(),
      courseId: otherCourse.id,
      title: 'Module 2',
      description: 'Other Module Description',
      order: 1,
      course: otherCourse,
    })

    const ownLesson = lessonSchema.parse({
      id: uuid(),
      moduleId: ownModule.id,
      title: 'Lesson 1',
      description: 'Lesson Description',
      providerType: 'youtube',
      providerVideoId: 'abc123',
      comment: null,
      order: 1,
      module: ownModule,
    })

    const otherLesson = lessonSchema.parse({
      id: uuid(),
      moduleId: otherModule.id,
      title: 'Lesson 2',
      description: 'Other Lesson Description',
      providerType: 'youtube',
      providerVideoId: 'xyz789',
      comment: null,
      order: 1,
      module: otherModule,
    })

    const ownCourseMaterial = courseMaterialSchema.parse({
      id: uuid(),
      courseId: ownCourse.id,
      title: 'Material 1',
      downloadUrl: 'https://example.com/material.pdf',
      course: ownCourse,
    })

    const otherCourseMaterial = courseMaterialSchema.parse({
      id: uuid(),
      courseId: otherCourse.id,
      title: 'Material 2',
      downloadUrl: 'https://example.com/other-material.pdf',
      course: otherCourse,
    })

    const ownEnrollment = enrollmentSchema.parse({
      id: uuid(),
      userId: uuid(),
      courseId: ownCourse.id,
      accessExpiresAt: new Date(),
      course: ownCourse,
    })

    const otherEnrollment = enrollmentSchema.parse({
      id: uuid(),
      userId: uuid(),
      courseId: otherCourse.id,
      accessExpiresAt: new Date(),
      course: otherCourse,
    })

    const ownProgress = progressSchema.parse({
      id: uuid(),
      userId: uuid(),
      lessonId: ownLesson.id,
      completed: true,
      rating: 5,
      lesson: ownLesson,
    })

    const otherProgress = progressSchema.parse({
      id: uuid(),
      userId: uuid(),
      lessonId: otherLesson.id,
      completed: true,
      rating: 5,
      lesson: otherLesson,
    })

    // const student = userSchema.parse({
    //   id: uuid(),
    //   email: 'student@example.com',
    //   name: 'Student',
    //   picture: 'https://test.com',
    //   role: 'STUDENT',
    // })

    const ability = defineAbilityFor(instructor)

    it('should allow INSTRUCTOR to create Course', () => {
      expect(ability.can('create', 'Course')).toBe(true)
    })

    it('should allow INSTRUCTOR to read own Course', () => {
      expect(ability.can('read', ownCourse)).toBe(true)
    })

    it('should not allow INSTRUCTOR to read Course of another instructor', () => {
      expect(ability.can('read', otherCourse)).toBe(false)
    })

    it('should allow INSTRUCTOR to update own Course', () => {
      expect(ability.can('update', ownCourse)).toBe(true)
    })

    it('should not allow INSTRUCTOR to update Course of another instructor', () => {
      expect(ability.can('update', otherCourse)).toBe(false)
    })

    it('should allow INSTRUCTOR to delete own Course', () => {
      expect(ability.can('delete', ownCourse)).toBe(true)
    })

    it('should not allow INSTRUCTOR to delete Course of another instructor', () => {
      expect(ability.can('delete', otherCourse)).toBe(false)
    })

    it('should allow INSTRUCTOR to create Module for own Course', () => {
      expect(ability.can('create', ownModule)).toBe(true)
    })

    it('should not allow INSTRUCTOR to create Module for another instructor’s Course', () => {
      expect(ability.can('create', otherModule)).toBe(false)
    })

    it('should allow INSTRUCTOR to read Module of own Course', () => {
      expect(ability.can('read', ownModule)).toBe(true)
    })

    it('should not allow INSTRUCTOR to read Module of another instructor’s Course', () => {
      expect(ability.can('read', otherModule)).toBe(false)
    })

    it('should allow INSTRUCTOR to update Module of own Course', () => {
      expect(ability.can('update', ownModule)).toBe(true)
    })

    it('should not allow INSTRUCTOR to update Module of another instructor’s Course', () => {
      expect(ability.can('update', otherModule)).toBe(false)
    })

    it('should allow INSTRUCTOR to delete Module of own Course', () => {
      expect(ability.can('delete', ownModule)).toBe(true)
    })

    it('should not allow INSTRUCTOR to delete Module of another instructor’s Course', () => {
      expect(ability.can('delete', otherModule)).toBe(false)
    })

    it('should allow INSTRUCTOR to create Lesson for own Course', () => {
      expect(ability.can('create', ownLesson)).toBe(true)
    })

    it('should not allow INSTRUCTOR to create Lesson for another instructor’s Course', () => {
      expect(ability.can('create', otherLesson)).toBe(false)
    })

    it('should allow INSTRUCTOR to read Lesson of own Course', () => {
      expect(ability.can('read', ownLesson)).toBe(true)
    })

    it('should not allow INSTRUCTOR to read Lesson of another instructor’s Course', () => {
      expect(ability.can('read', otherLesson)).toBe(false)
    })

    it('should allow INSTRUCTOR to update Lesson of own Course', () => {
      expect(ability.can('update', ownLesson)).toBe(true)
    })

    it('should not allow INSTRUCTOR to update Lesson of another instructor’s Course', () => {
      expect(ability.can('update', otherLesson)).toBe(false)
    })

    it('should allow INSTRUCTOR to delete Lesson of own Course', () => {
      expect(ability.can('delete', ownLesson)).toBe(true)
    })

    it('should not allow INSTRUCTOR to delete Lesson of another instructor’s Course', () => {
      expect(ability.can('delete', otherLesson)).toBe(false)
    })

    it('should allow INSTRUCTOR to create CourseMaterial for own Course', () => {
      expect(ability.can('create', ownCourseMaterial)).toBe(true)
    })

    it('should not allow INSTRUCTOR to create CourseMaterial for another instructor’s Course', () => {
      expect(ability.can('create', otherCourseMaterial)).toBe(false)
    })

    it('should allow INSTRUCTOR to read CourseMaterial of own Course', () => {
      expect(ability.can('read', ownCourseMaterial)).toBe(true)
    })

    it('should not allow INSTRUCTOR to read CourseMaterial of another instructor’s Course', () => {
      expect(ability.can('read', otherCourseMaterial)).toBe(false)
    })

    it('should allow INSTRUCTOR to update CourseMaterial of own Course', () => {
      expect(ability.can('update', ownCourseMaterial)).toBe(true)
    })

    it('should not allow INSTRUCTOR to update CourseMaterial of another instructor’s Course', () => {
      expect(ability.can('update', otherCourseMaterial)).toBe(false)
    })

    it('should allow INSTRUCTOR to delete CourseMaterial of own Course', () => {
      expect(ability.can('delete', ownCourseMaterial)).toBe(true)
    })

    it('should not allow INSTRUCTOR to delete CourseMaterial of another instructor’s Course', () => {
      expect(ability.can('delete', otherCourseMaterial)).toBe(false)
    })

    it('should allow INSTRUCTOR to read Enrollment of own Course', () => {
      expect(ability.can('read', ownEnrollment)).toBe(true)
    })

    it('should not allow INSTRUCTOR to read Enrollment of another instructor’s Course', () => {
      expect(ability.can('read', otherEnrollment)).toBe(false)
    })

    it('should allow INSTRUCTOR to read Progress of own Course', () => {
      expect(ability.can('read', ownProgress)).toBe(true)
    })

    it('should not allow INSTRUCTOR to read Progress of another instructor’s Course', () => {
      expect(ability.can('read', otherProgress)).toBe(false)
    })

    // Fazer depois
    // it('should allow INSTRUCTOR to read User', () => {
    //   expect(ability.can('read', student)).toBe(true)
    // })
  })

  describe('Permissions for STUDENT role', () => {
    const student = userSchema.parse({
      id: uuid(),
      email: 'student@example.com',
      name: 'Student',
      picture: 'https://test.com',
      role: 'STUDENT',
    })

    const approvedCourse = courseSchema.parse({
      id: uuid(),
      title: 'Test Course',
      description: 'Description',
      category: 'Tech',
      logoImage: 'https://example.com/logo.jpg',
      accessDurationMonths: 12,
      instructorId: uuid(),
      status: 'approved',
    })

    const draftCourse = courseSchema.parse({
      id: uuid(),
      title: 'Draft Course',
      description: 'Draft Description',
      category: 'Tech',
      logoImage: 'https://example.com/draft.jpg',
      accessDurationMonths: 12,
      instructorId: uuid(),
      status: 'draft',
    })

    const module = moduleSchema.parse({
      id: uuid(),
      courseId: approvedCourse.id,
      title: 'Module 1',
      description: 'Module Description',
      order: 1,
      course: approvedCourse,
    })

    const lesson = lessonSchema.parse({
      id: uuid(),
      moduleId: module.id,
      title: 'Lesson 1',
      description: 'Lesson Description',
      providerType: 'youtube',
      providerVideoId: 'abc123',
      comment: null,
      order: 1,
      module,
    })

    const enrollment = enrollmentSchema.parse({
      id: uuid(),
      userId: student.id,
      courseId: approvedCourse.id,
      accessExpiresAt: new Date(),
      course: approvedCourse,
    })

    const ownProgress = progressSchema.parse({
      id: uuid(),
      userId: student.id,
      lessonId: lesson.id,
      completed: true,
      rating: 5,
      lesson,
    })

    const otherProgress = progressSchema.parse({
      id: uuid(),
      userId: uuid(),
      lessonId: lesson.id,
      completed: true,
      rating: 5,
      lesson,
    })

    const courseMaterial = courseMaterialSchema.parse({
      id: uuid(),
      courseId: approvedCourse.id,
      title: 'Material 1',
      downloadUrl: 'https://example.com/material.pdf',
      course: approvedCourse,
    })

    const ability = defineAbilityFor(student)

    it('should allow STUDENT to read approved Course', () => {
      expect(ability.can('read', approvedCourse)).toBe(true)
    })

    it('should not allow STUDENT to read non-approved Course', () => {
      expect(ability.can('read', draftCourse)).toBe(false)
    })

    it('should allow STUDENT to create Enrollment', () => {
      expect(ability.can('create', 'Enrollment')).toBe(true)
    })

    it('should allow STUDENT to read own Enrollment', () => {
      expect(ability.can('read', enrollment)).toBe(true)
    })

    it('should not allow STUDENT to read Enrollment of another user', () => {
      const otherEnrollment = enrollmentSchema.parse({
        ...enrollment,
        userId: uuid(),
      })

      expect(ability.can('read', otherEnrollment)).toBe(false)
    })

    it('should allow STUDENT to read Module', () => {
      expect(ability.can('read', module)).toBe(true)
    })

    it('should allow STUDENT to read Lesson', () => {
      expect(ability.can('read', lesson)).toBe(true)
    })

    it('should allow STUDENT to create Progress', () => {
      expect(ability.can('create', 'Progress')).toBe(true)
    })

    it('should allow STUDENT to read own Progress', () => {
      expect(ability.can('read', ownProgress)).toBe(true)
    })

    it('should not allow STUDENT to read Progress of another user', () => {
      expect(ability.can('read', otherProgress)).toBe(false)
    })

    it('should allow STUDENT to update own Progress', () => {
      expect(ability.can('update', ownProgress)).toBe(true)
    })

    it('should not allow STUDENT to update Progress of another user', () => {
      expect(ability.can('update', otherProgress)).toBe(false)
    })

    it('should allow STUDENT to read CourseMaterial', () => {
      expect(ability.can('read', courseMaterial)).toBe(true)
    })

    it('should allow STUDENT to read own User profile', () => {
      expect(ability.can('read', student)).toBe(true)
    })

    it('should not allow STUDENT to read another User profile', () => {
      const otherUser = userSchema.parse({
        id: uuid(),
        email: 'other@example.com',
        name: 'Other',
        picture: 'https://test.com',
        role: 'STUDENT',
      })

      expect(ability.can('read', otherUser)).toBe(false)
    })

    it('should allow STUDENT to update own User profile', () => {
      expect(ability.can('update', student)).toBe(true)
    })

    it('should not allow STUDENT to update another User profile', () => {
      const otherUser = userSchema.parse({
        id: uuid(),
        email: 'other@example.com',
        name: 'Other',
        picture: 'https://test.com',
        role: 'STUDENT',
      })

      expect(ability.can('update', otherUser)).toBe(false)
    })
  })
})
