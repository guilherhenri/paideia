import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  UserRelations,
  UsersRepository,
} from '@/repositories/interfaces/users-repository'

interface FindUserWithEnrolledCoursesUseCaseRequest {
  id: string
}

export type FindUserWithEnrolledCoursesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: UserRelations['WithEnrolledCourses']
  }
>

export class FindUserWithEnrolledCoursesUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    id,
  }: FindUserWithEnrolledCoursesUseCaseRequest): Promise<FindUserWithEnrolledCoursesUseCaseResponse> {
    const user = await this.usersRepository.findByIdWithEnrolledCourses(id)

    if (!user) {
      return left(new ResourceNotFoundError('Usuário não encontrado.'))
    }

    return right({ user })
  }
}
