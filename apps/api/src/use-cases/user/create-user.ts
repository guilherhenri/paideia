import { randomUUID } from 'crypto'

interface User {
  id: string
  name: string
  email: string
}

const users: User[] = []

interface CreateUserUseCaseRequest {
  name: string
  email: string
}

export class CreateUserUseCase {
  async execute({ name, email }: CreateUserUseCaseRequest): Promise<void> {
    users.push({
      id: randomUUID(),
      name,
      email,
    })
  }
}
