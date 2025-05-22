import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  CourseRelations,
  CoursesRepository,
} from '@/repositories/interfaces/courses-repository'

interface FindCourseWithModulesUseCaseRequest {
  id: string
}

export type FindCourseWithModulesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    course: CourseRelations['WithModules']
  }
>

export class FindCourseWithModulesUseCase {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute({
    id,
  }: FindCourseWithModulesUseCaseRequest): Promise<FindCourseWithModulesUseCaseResponse> {
    const course = await this.coursesRepository.findByIdWithModules(id)

    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    return right({ course })
  }
}
