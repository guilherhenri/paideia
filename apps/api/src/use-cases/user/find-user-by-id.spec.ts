import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { FindUserByIdUseCase } from './find-user-by-id'

describe('FindUserByIdUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: FindUserByIdUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FindUserByIdUseCase(usersRepository)
  })

  it('should find a user by id', async () => {
    const user = await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
    })

    const response = await sut.execute({
      id: user.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({
        id: user.id,
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
      }),
    })
  })

  it('should return not found error if user does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Usuário não encontrado.')
    }
  })
})
