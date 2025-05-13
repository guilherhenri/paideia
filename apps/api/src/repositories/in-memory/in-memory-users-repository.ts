import type { Prisma, Role, User } from '@prisma/client'
import { randomUUID } from 'crypto'

import type {
  UserRelations,
  UsersRepository,
} from '../interfaces/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findById(id: string): Promise<UserRelations['Basic'] | null> {
    const user = this.users.find((user) => user.id === id)

    return user ?? null
  }

  async findByEmail(email: string): Promise<UserRelations['Basic'] | null> {
    const user = this.users.find((user) => user.email === email)

    return user ?? null
  }

  async findByIdWithEnrolledCourses(
    id: string,
  ): Promise<UserRelations['WithEnrolledCourses'] | null> {
    const user = this.users.find((user) => user.id === id)

    return (user as UserRelations['WithEnrolledCourses']) ?? null
  }

  async list({ role }: { role?: Role }): Promise<UserRelations['Basic'][]> {
    if (!role) return this.users

    const users = this.users.filter((user) => user.role === role)

    return users
  }

  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      role: data.role,
      picture: data.picture ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async save(data: User): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === data.id)

    if (userIndex >= 0) {
      this.users[userIndex] = data
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id)
  }
}
