import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  CourseRelations,
  CoursesRepository,
} from '@/repositories/interfaces/courses-repository'

interface FindCourseWithInstructorUseCaseRequest {
  id: string
}

export type FindCourseWithInstructorUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    course: CourseRelations['WithInstructor']
  }
>

export class FindCourseWithInstructorUseCase {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async execute({
    id,
  }: FindCourseWithInstructorUseCaseRequest): Promise<FindCourseWithInstructorUseCaseResponse> {
    const course = await this.coursesRepository.findByIdWithInstructor(id)

    if (!course) {
      return left(new ResourceNotFoundError('Curso não encontrado.'))
    }

    return right({ course })
  }
}
