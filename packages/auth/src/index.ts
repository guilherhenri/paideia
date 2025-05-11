import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import type { User } from './models/user'
import { permissions } from './permissions'
import { courseSubject } from './subjects/course'
import { courseMaterialSubject } from './subjects/course-material'
import { enrollmentSubject } from './subjects/enrollment'
import { lessonSubject } from './subjects/lesson'
import { moduleSubject } from './subjects/module'
import { progressSubject } from './subjects/progress'
import { userSubject } from './subjects/user'

export * from './models/course'
export * from './models/course-material'
export * from './models/enrollment'
export * from './models/lesson'
export * from './models/module'
export * from './models/progress'
export * from './models/user'
export * from './roles'

const appAbilitiesSchema = z.union([
  userSubject,
  courseSubject,
  moduleSubject,
  lessonSubject,
  enrollmentSubject,
  progressSubject,
  courseMaterialSubject,
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
