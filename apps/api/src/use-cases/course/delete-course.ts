import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { CoursesRepository } from '@/repositories/interfaces/courses-repository'

interface DeleteCourseUseCaseRequest {
  id: string
}

export type DeleteCourseUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteCourseUseCase {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute({
    id,
  }: DeleteCourseUseCaseRequest): Promise<DeleteCourseUseCaseResponse> {
    const course = await this.coursesRepository.findById(id)

    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    await this.coursesRepository.delete(id)

    return right({})
  }
}
