import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  CourseRelations,
  CoursesRepository,
} from '@/repositories/interfaces/courses-repository'

interface FindCourseWithMaterialsUseCaseRequest {
  id: string
}

export type FindCourseWithMaterialsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    course: CourseRelations['WithMaterials']
  }
>

export class FindCourseWithMaterialsUseCase {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute({
    id,
  }: FindCourseWithMaterialsUseCaseRequest): Promise<FindCourseWithMaterialsUseCaseResponse> {
    const course = await this.coursesRepository.findByIdWithMaterials(id)

    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    return right({ course })
  }
}
