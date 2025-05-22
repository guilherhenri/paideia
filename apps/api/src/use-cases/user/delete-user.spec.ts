import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { DeleteUserUseCase } from './delete-user'

describe('DeleteUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: DeleteUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should delete a user', async () => {
    const user = await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
    })

    const response = await sut.execute({
      id: user.id,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({})

    const deletedUser = await usersRepository.findById(user.id)
    expect(deletedUser).toBeNull()
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
