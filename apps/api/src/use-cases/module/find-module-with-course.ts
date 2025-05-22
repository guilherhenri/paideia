import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  ModuleRelations,
  ModulesRepository,
} from '@/repositories/interfaces/modules-repository'

interface FindModuleWithCourseUseCaseRequest {
  id: string
}

export type FindModuleWithCourseUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    module: ModuleRelations['WithCourse']
  }
>

export class FindModuleWithCourseUseCase {
  constructor(private readonly modulesRepository: ModulesRepository) {}

  async execute({
    id,
  }: FindModuleWithCourseUseCaseRequest): Promise<FindModuleWithCourseUseCaseResponse> {
    const module = await this.modulesRepository.findByIdWithCourse(id)

    if (!module) {
      return left(new ResourceNotFoundError('Módulo não encontrado.'))
    }

    return right({ module })
  }
}
