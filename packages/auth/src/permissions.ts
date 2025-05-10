import type { AbilityBuilder } from '@casl/ability'

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
    can('create', 'Course')
    can('read', 'Course')
    can('update', 'Course', { instructorId: user.id })
    can('delete', 'Course', { instructorId: user.id })

    can('create', 'Module', undefined, { course: { instructorId: user.id } })
    can('read', 'Module')
    can('update', 'Module', undefined, { course: { instructorId: user.id } })
    can('delete', 'Module', undefined, { course: { instructorId: user.id } })

    can('create', 'Lesson', undefined, {
      module: { course: { instructorId: user.id } },
    })
    can('read', 'Lesson')
    can('update', 'Lesson', undefined, {
      module: { course: { instructorId: user.id } },
    })
    can('delete', 'Lesson', undefined, {
      module: { course: { instructorId: user.id } },
    })

    can('create', 'CourseMaterial', { course: { instructorId: user.id } })
    can('read', 'CourseMaterial')
    can('update', 'CourseMaterial', { course: { instructorId: user.id } })
    can('delete', 'CourseMaterial', { course: { instructorId: user.id } })

    can('read', 'Enrollment', { course: { instructorId: user.id } })
    can('read', 'Progress')
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
