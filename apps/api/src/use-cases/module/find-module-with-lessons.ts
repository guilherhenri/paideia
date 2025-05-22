import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type {
  ModuleRelations,
  ModulesRepository,
} from '@/repositories/interfaces/modules-repository'

interface FindModuleWithLessonsUseCaseRequest {
  id: string
}

export type FindModuleWithLessonsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    module: ModuleRelations['WithLessons']
  }
>

export class FindModuleWithLessonsUseCase {
  constructor(private readonly modulesRepository: ModulesRepository) {}

  async execute({
    id,
  }: FindModuleWithLessonsUseCaseRequest): Promise<FindModuleWithLessonsUseCaseResponse> {
    const module = await this.modulesRepository.findByIdWithLessons(id)

    if (!module) {
      return left(new ResourceNotFoundError('Módulo não encontrado.'))
    }

    return right({ module })
  }
}
