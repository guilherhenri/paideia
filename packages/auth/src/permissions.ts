import type { AbilityBuilder, MongoQuery } from '@casl/ability'

import type { AppAbility } from '.'
import type { User } from './models/user'
import type { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(_, { can }) {
    can('manage', [
      'User',
      'Course',
      'Module',
      'Lesson',
      'Enrollment',
      'Progress',
      'CourseMaterial',
    ])
  },
  INSTRUCTOR(user, { can }) {
    const courseInstructorCondition: MongoQuery = {
      'course.instructorId': user.id,
    }
    const moduleCourseInstructorCondition: MongoQuery = {
      'module.course.instructorId': user.id,
    }
    const lessonModuleCourseInstructorCondition: MongoQuery = {
      'lesson.module.course.instructorId': user.id,
    }

    can('create', 'Course')
    can(['read', 'update', 'delete'], 'Course', { instructorId: user.id })

    can(
      ['create', 'read', 'update', 'delete'],
      'Module',
      courseInstructorCondition,
    )

    can(
      ['create', 'read', 'update', 'delete'],
      'Lesson',
      moduleCourseInstructorCondition,
    )

    can(
      ['create', 'read', 'update', 'delete'],
      'CourseMaterial',
      courseInstructorCondition,
    )

    can('read', 'Enrollment', courseInstructorCondition)
    can('read', 'Progress', lessonModuleCourseInstructorCondition)
    can('read', 'User')
  },
  STUDENT(user, { can }) {
    can('read', 'Course', { status: 'approved' })
    can('create', 'Enrollment')
    can('read', 'Enrollment', { userId: user.id })

    can('read', 'Module')
    can('read', 'Lesson')
    can('create', 'Progress')
    can(['read', 'update'], 'Progress', { userId: user.id })

    can('read', 'CourseMaterial')

    can(['read', 'update'], 'User', { id: user.id })
  },
}
