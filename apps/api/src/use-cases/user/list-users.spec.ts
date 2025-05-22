import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ListUsersUseCase } from './list-users'

describe('ListUsersUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: ListUsersUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ListUsersUseCase(usersRepository)
  })

  it('should list all users', async () => {
    await usersRepository.create({
      email: 'test1@example.com',
      name: 'Test User 1',
      role: 'STUDENT',
    })
    await usersRepository.create({
      email: 'test2@example.com',
      name: 'Test User 2',
      role: 'INSTRUCTOR',
    })

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.users).toHaveLength(2)
    expect(response.value).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({ email: 'test1@example.com' }),
        expect.objectContaining({ email: 'test2@example.com' }),
      ]),
    })
  })

  it('should list users by role', async () => {
    await usersRepository.create({
      email: 'test1@example.com',
      name: 'Test User 1',
      role: 'STUDENT',
    })
    await usersRepository.create({
      email: 'test2@example.com',
      name: 'Test User 2',
      role: 'INSTRUCTOR',
    })

    const response = await sut.execute({ role: 'STUDENT' })

    expect(response.isRight()).toBe(true)
    expect(response.value.users).toHaveLength(1)
    expect(response.value).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({
          email: 'test1@example.com',
          role: 'STUDENT',
        }),
      ]),
    })
  })

  it('should return empty list if no users exist', async () => {
    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    expect(response.value.users).toHaveLength(0)
    expect(response.value).toEqual({ users: [] })
  })
})
