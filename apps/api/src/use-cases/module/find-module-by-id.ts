import type { Module } from '@prisma/client'

import { type Either, left, right } from '@/either'
import { ResourceNotFoundError } from '@/lib/errors/resource-not-found-error'
import type { ModulesRepository } from '@/repositories/interfaces/modules-repository'

interface FindModuleByIdUseCaseRequest {
  id: string
}

export type FindModuleByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    module: Module
  }
>

export class FindModuleByIdUseCase {
  constructor(private readonly modulesRepository: ModulesRepository) {}

  async execute({
    id,
  }: FindModuleByIdUseCaseRequest): Promise<FindModuleByIdUseCaseResponse> {
    const module = await this.modulesRepository.findById(id)

    if (!module) {
      return left(new ResourceNotFoundError('Módulo não encontrado.'))
    }

    return right({ module })
  }
}
