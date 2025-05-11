import { v4 as uuid } from 'uuid'
import { describe, expect, it } from 'vitest'

import { defineAbilityFor, type Role } from '.'
import { userSchema } from './models/user'

describe('defineAbilityFor', () => {
  it('should create ability instance for ADMIN role', () => {
    const admin = userSchema.parse({
      id: uuid(),
      email: 'admin@example.com',
      name: 'Admin',
      picture: 'https://test.com',
      role: 'ADMIN',
    })

    const ability = defineAbilityFor(admin)

    expect(ability).toBeDefined()
    expect(ability).toHaveProperty('can')
    expect(ability).toHaveProperty('cannot')
    expect(typeof ability.can).toBe('function')
    expect(typeof ability.cannot).toBe('function')
  })

  it('should create ability instance for INSTRUCTOR role', () => {
    const instructor = userSchema.parse({
      id: uuid(),
      email: 'instructor@example.com',
      name: 'Instructor',
      picture: 'https://test.com',
      role: 'INSTRUCTOR',
    })

    const ability = defineAbilityFor(instructor)

    expect(ability).toBeDefined()
    expect(ability).toHaveProperty('can')
    expect(ability).toHaveProperty('cannot')
    expect(typeof ability.can).toBe('function')
    expect(typeof ability.cannot).toBe('function')
  })

  it('should create ability instance for STUDENT role', () => {
    const student = userSchema.parse({
      id: uuid(),
      email: 'student@example.com',
      name: 'Student',
      picture: 'https://test.com',
      role: 'STUDENT',
    })

    const ability = defineAbilityFor(student)

    expect(ability).toBeDefined()
    expect(ability).toHaveProperty('can')
    expect(ability).toHaveProperty('cannot')
    expect(typeof ability.can).toBe('function')
    expect(typeof ability.cannot).toBe('function')
  })

  it('should throw error for invalid role', () => {
    const invalidUser = userSchema.parse({
      __typename: 'User',
      id: uuid(),
      email: 'invalid@example.com',
      name: 'Invalid',
      picture: 'https://test.com',
      role: 'ADMIN', // Força um papel inválido
    })

    expect(() =>
      defineAbilityFor({ ...invalidUser, role: 'INVALID' as Role }),
    ).toThrowError(`Permissions for role INVALID not found.`)
  })
})
