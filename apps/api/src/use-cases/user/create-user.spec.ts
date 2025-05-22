import { beforeEach, describe, expect, it } from 'vitest'

import { ConflictFoundError } from '@/lib/errors/conflict-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { CreateUserUseCase } from './create-user'

describe('CreateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: CreateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(usersRepository)
  })

  it('should create a user with valid data', async () => {
    const response = await sut.execute({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
      password: 'password123',
      picture: 'https://example.com/picture.jpg',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
        picture: 'https://example.com/picture.jpg',
      }),
    })
    if (response.isRight()) {
      expect(response.value.user.password_hash).not.toBe('password123')
    }
  })

  it('should create a user without password', async () => {
    const response = await sut.execute({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT',
        password_hash: null,
      }),
    })
  })

  it('should reject creation if email already exists', async () => {
    await usersRepository.create({
      email: 'test@example.com',
      name: 'Existing User',
      role: 'STUDENT',
    })

    const response = await sut.execute({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ConflictFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe('E-mail já registrado.')
    }
  })
})
