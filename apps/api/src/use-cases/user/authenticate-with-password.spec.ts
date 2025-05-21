import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { ConflictFoundError } from '@/lib/errors/conflict-error'
import { InvalidCredentialsError } from '@/lib/errors/invalid-credentials-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { AuthenticateWithPasswordUseCase } from './authenticate-with-password'

describe('AuthenticateWithPasswordUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateWithPasswordUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateWithPasswordUseCase(usersRepository)
  })

  it('should authenticate user with valid email and password', async () => {
    const password = 'password123'
    const passwordHash = await hash(password, 6)

    const user = await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
      password_hash: passwordHash,
    })

    const response = await sut.execute({
      email: 'test@example.com',
      password,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({
      user: expect.objectContaining({ id: user.id }),
    })
  })

  it('should reject authentication with invalid email', async () => {
    const response = await sut.execute({
      email: 'nonexistent@example.com',
      password: 'password123',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should reject authentication with invalid password', async () => {
    const passwordHash = await hash('password123', 6)

    await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
      password_hash: passwordHash,
    })

    const response = await sut.execute({
      email: 'test@example.com',
      password: 'wrongpassword',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should reject authentication if user has no password (social login)', async () => {
    await usersRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      role: 'STUDENT',
      password_hash: null,
    })

    const response = await sut.execute({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ConflictFoundError)
    if (response.isLeft()) {
      expect(response.value.message).toBe(
        'Você não possui uma senha, use o login social.',
      )
    }
  })
})
