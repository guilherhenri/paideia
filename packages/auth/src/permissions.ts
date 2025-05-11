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
    can('manage', 'User')
    can('manage', 'Course')
    can('manage', 'Module')
    can('manage', 'Lesson')
    can('manage', 'Enrollment')
    can('manage', 'Progress')
    can('manage', 'CourseMaterial')
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
    can('read', 'Course', { instructorId: user.id })
    can('update', 'Course', { instructorId: user.id })
    can('delete', 'Course', { instructorId: user.id })

    can('create', 'Module', courseInstructorCondition)
    can('read', 'Module', courseInstructorCondition)
    can('update', 'Module', courseInstructorCondition)
    can('delete', 'Module', courseInstructorCondition)

    can('create', 'Lesson', moduleCourseInstructorCondition)
    can('read', 'Lesson', moduleCourseInstructorCondition)
    can('update', 'Lesson', moduleCourseInstructorCondition)
    can('delete', 'Lesson', moduleCourseInstructorCondition)

    can('create', 'CourseMaterial', courseInstructorCondition)
    can('read', 'CourseMaterial', courseInstructorCondition)
    can('update', 'CourseMaterial', courseInstructorCondition)
    can('delete', 'CourseMaterial', courseInstructorCondition)

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
    can('read', 'Progress', { userId: user.id })
    can('update', 'Progress', { userId: user.id })

    can('read', 'CourseMaterial')

    can('read', 'User', { id: user.id })
    can('update', 'User', { id: user.id })
  },
}
