import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { ModulesRepository } from '@/repositories/interfaces/modules-repository'

interface DeleteModuleUseCaseRequest {
  id: string
}

export type DeleteModuleUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteModuleUseCase {
  constructor(private readonly modulesRepository: ModulesRepository) {}

  async execute({
    id,
  }: DeleteModuleUseCaseRequest): Promise<DeleteModuleUseCaseResponse> {
    const module = await this.modulesRepository.findById(id)

    if (!module) {
      return left(new ResourceNotFoundError('Módulo não encontrado.'))
    }

    await this.modulesRepository.delete(id)

    return right({})
  }
}
