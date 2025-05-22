import { beforeEach, describe, expect, it } from 'vitest'

import { ConflictFoundError } from '@/lib/errors/conflict-error'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UpdateUserUseCase } from './update-user'

describe('UpdateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: UpdateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should update user data', async () => {
    const user = await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
      password_hash: 'hashed-password',
    })

    const response = await sut.execute({
      id: user.id,
      email: 'new@example.com',
      name: 'Updated User',
      role: 'INSTRUCTOR',
      picture: 'https://new.com/picture.jpg',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({
        email: 'new@example.com',
        name: 'Updated User',
        role: 'INSTRUCTOR',
        picture: 'https://new.com/picture.jpg',
        password_hash: 'hashed-password',
      }),
    })
  })

  it('should update user password', async () => {
    const user = await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
      password_hash: 'old-hashed-password',
    })

    const response = await sut.execute({
      id: user.id,
      password: 'newpassword123',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
      }),
    })

    if (response.isRight()) {
      expect(response.value.user.password_hash).not.toBe('old-hashed-password')
      expect(response.value.user.password_hash).not.toBe('newpassword123')
    }
  })

  it('should remove user picture', async () => {
    const user = await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
      picture: 'https://old.com/picture.jpg',
    })

    const response = await sut.execute({
      id: user.id,
      picture: null,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
        picture: null,
      }),
    })
  })

  it('should return not found error if user does not exist', async () => {
    const response = await sut.execute({
      id: 'non-existent-id',
      name: 'Updated User',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('Usuário não encontrado.')
    }
  })

  it('should return conflict error if email is already taken', async () => {
    await usersRepository.create({
      email: 'existing@example.com',
      name: 'Existing User',
      role: 'STUDENT',
    })

    const user = await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
    })

    const response = await sut.execute({
      id: user.id,
      email: 'existing@example.com',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ConflictFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('E-mail já registrado.')
    }
  })
})
