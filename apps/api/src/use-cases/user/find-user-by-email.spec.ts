import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { FindUserByEmailUseCase } from './find-user-by-email'

describe('FindUserByEmailUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: FindUserByEmailUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FindUserByEmailUseCase(usersRepository)
  })

  it('should find a user by email', async () => {
    await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
    })

    const response = await sut.execute({
      email: 'test@example.com',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
      }),
    })
  })

  it('should return resource not found error if user does not exist', async () => {
    const response = await sut.execute({
      email: 'nonexistent@example.com',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Usuário não encontrado.')
    }
  })
})
