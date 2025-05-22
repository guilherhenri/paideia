import type { Module } from '@prisma/client'

import { type Either, right } from '@/either'
import type { ModulesRepository } from '@/repositories/interfaces/modules-repository'

interface ListModulesUseCaseRequest {
  courseId?: string
}

export type ListModulesUseCaseResponse = Either<
  never,
  {
    modules: Module[]
  }
>

export class ListModulesUseCase {
  constructor(private readonly modulesRepository: ModulesRepository) {}

  async execute({
    courseId,
  }: ListModulesUseCaseRequest): Promise<ListModulesUseCaseResponse> {
    const modules = await this.modulesRepository.list({ courseId })

    return right({ modules })
  }
}
